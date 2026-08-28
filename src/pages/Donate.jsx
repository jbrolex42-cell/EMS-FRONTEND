import { useState } from "react";
import { Link } from "react-router-dom";

import {
  FiHeart,
  FiArrowLeft,
  FiCheckCircle,
  FiShield,
  FiCreditCard,
  FiSmartphone,
  FiUser,
  FiMail,
  FiPhone,
  FiLoader,
  FiAlertCircle,
  FiInfo,
} from "react-icons/fi";

import { FaMobileAlt } from "react-icons/fa";

/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
*/

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

/*
|--------------------------------------------------------------------------
| PAYMENT INFORMATION
|--------------------------------------------------------------------------
|
| These are display/reference details.
| Actual production credentials MUST remain in the backend .env.
|
*/

const MPESA_DETAILS = {
  paybill: "522522",
  account: "1296571637",
};

const KCB_DETAILS = {
  bank: "KCB Bank",
  accountName: "ROLEX",
  accountNumber: "1296571637",
};

const AIRTEL_DETAILS = {
  name: "Airtel Money",
  instructions:
    "Enter your Airtel Money number and follow the payment instructions.",
};

/*
|--------------------------------------------------------------------------
| PAYMENT METHODS
|--------------------------------------------------------------------------
*/

const PAYMENT_METHODS = {
  mpesa: {
    name: "M-PESA",
    description: "STK Push",
  },

  kcb: {
    name: "KCB",
    description: "KCB payment",
  },

  airtel: {
    name: "Airtel Money",
    description: "Airtel payment",
  },
};

export default function Donate() {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("mpesa");

  const [purpose, setPurpose] =
    useState("Emergency Response");

  const [anonymous, setAnonymous] =
    useState(false);

  const [status, setStatus] =
    useState("idle");

  const [error, setError] =
    useState("");

  const [donation, setDonation] =
    useState(null);

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      phone: "",
    });

  /*
  |--------------------------------------------------------------------------
  | DONATION AMOUNT
  |--------------------------------------------------------------------------
  */

  const donationAmount =
    amount === "custom"
      ? Number(customAmount) || 0
      : Number(amount);

  /*
  |--------------------------------------------------------------------------
  | FORM CHANGE
  |--------------------------------------------------------------------------
  */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | VALIDATE
  |--------------------------------------------------------------------------
  */

  const validateForm = () => {
    if (
      !Number.isFinite(donationAmount) ||
      donationAmount < 10
    ) {
      setError(
        "Please enter a donation amount of at least KSh 10."
      );

      return false;
    }

    if (
      !anonymous &&
      !formData.name.trim()
    ) {
      setError(
        "Please enter your full name or select Anonymous Donation."
      );

      return false;
    }

    if (!formData.phone.trim()) {
      setError(
        `Please enter your ${PAYMENT_METHODS[paymentMethod].name} phone number.`
      );

      return false;
    }

    /*
    * Basic Kenyan phone validation.
    *
    * Accepts:
    * 0712345678
    * 0112345678
    * 254712345678
    * +254712345678
    */

    const cleanedPhone =
      formData.phone
        .trim()
        .replace(/\s+/g, "");

    const validPhone =
      /^(?:\+254|254|0)(?:7|1)\d{8}$/.test(
        cleanedPhone
      );

    if (!validPhone) {
      setError(
        "Please enter a valid Kenyan phone number, for example 0712345678."
      );

      return false;
    }

    setError("");

    return true;
  };

  /*
  |--------------------------------------------------------------------------
  | M-PESA STATUS POLLING
  |--------------------------------------------------------------------------
  */

  const pollMpesaStatus = async (
    checkoutRequestId
  ) => {
    let attempts = 0;

    const maxAttempts = 40;

    const checkStatus = async () => {
      attempts += 1;

      try {
        const response = await fetch(
          `${API_BASE}/donations/status/${encodeURIComponent(
            checkoutRequestId
          )}`
        );

        const data =
          await response.json();

        /*
        * A temporary 404 should not immediately
        * destroy the payment flow.
        *
        * The backend may not have saved the
        * callback yet.
        */

        if (response.ok && data.success) {
          if (data.donation) {
            setDonation(data.donation);

            if (
              data.donation.status ===
              "completed"
            ) {
              setStatus("success");
              return;
            }

            if (
              data.donation.status ===
              "cancelled"
            ) {
              setError(
                "The M-PESA payment was cancelled."
              );

              setStatus("error");
              return;
            }

            if (
              data.donation.status ===
              "failed"
            ) {
              setError(
                data.donation.resultDescription ||
                  "The M-PESA payment was not completed."
              );

              setStatus("error");
              return;
            }
          }
        }
      } catch (pollError) {
        console.error(
          "M-PESA STATUS ERROR:",
          pollError
        );
      }

      if (attempts < maxAttempts) {
        setTimeout(
          checkStatus,
          3000
        );
      } else {
        setError(
          "We are still waiting for payment confirmation from M-PESA. Please check your M-PESA messages."
        );

        setStatus("waiting");
      }
    };

    checkStatus();
  };

  /*
  |--------------------------------------------------------------------------
  | SUBMIT DONATION
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus("processing");
    setError("");
    setDonation(null);

    try {
      /*
      |--------------------------------------------------------------------------
      | M-PESA
      |--------------------------------------------------------------------------
      */

      if (paymentMethod === "mpesa") {
        const response = await fetch(
          `${API_BASE}/donations/mpesa/stkpush`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              amount: donationAmount,

              phone: formData.phone,

              name: anonymous
                ? "Anonymous"
                : formData.name,

              email: formData.email,

              purpose,

              paymentMethod: "mpesa",

              anonymous,
            }),
          }
        );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to initiate M-PESA payment."
          );
        }

        setDonation(
          data.donation || {
            id: data.donationId,
            amount: donationAmount,
            status:
              data.status ||
              "processing",
            paymentMethod:
              "mpesa",
          }
        );

        /*
        * Safaricom returns a CheckoutRequestID.
        * We use it to monitor the donation.
        */

        if (
          data.checkoutRequestId
        ) {
          setStatus("waiting");

          pollMpesaStatus(
            data.checkoutRequestId
          );

          return;
        }

        /*
        * If the backend does not return a
        * CheckoutRequestID, don't falsely
        * claim success.
        */

        setStatus("waiting");

        setError(
          "M-PESA request was submitted, but we are waiting for confirmation."
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | KCB
      |--------------------------------------------------------------------------
      */

      if (paymentMethod === "kcb") {
        const response = await fetch(
          `${API_BASE}/donations/kcb`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              amount: donationAmount,

              phone: formData.phone,

              name: anonymous
                ? "Anonymous"
                : formData.name,

              email: formData.email,

              purpose,

              paymentMethod: "kcb",

              anonymous,
            }),
          }
        );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to initiate KCB payment."
          );
        }

        setDonation(
          data.donation || {
            id: data.donationId,
            amount: donationAmount,
            status:
              data.status ||
              "processing",
            paymentMethod:
              "kcb",
          }
        );

        /*
        * KCB may return processing until
        * the payment notification arrives.
        */

        if (
          data.status ===
          "completed"
        ) {
          setStatus("success");
        } else {
          setStatus("waiting");
        }

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | AIRTEL MONEY
      |--------------------------------------------------------------------------
      */

      if (paymentMethod === "airtel") {
        const response = await fetch(
          `${API_BASE}/donations/airtel`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              amount: donationAmount,

              phone: formData.phone,

              name: anonymous
                ? "Anonymous"
                : formData.name,

              email: formData.email,

              purpose,

              paymentMethod: "airtel",

              anonymous,
            }),
          }
        );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to initiate Airtel Money payment."
          );
        }

        setDonation(
          data.donation || {
            id: data.donationId,
            amount: donationAmount,
            status:
              data.status ||
              "processing",
            paymentMethod:
              "airtel",
          }
        );

        if (
          data.status ===
          "completed"
        ) {
          setStatus("success");
        } else {
          setStatus("waiting");
        }

        return;
      }

      throw new Error(
        "Unsupported payment method."
      );
    } catch (submitError) {
      console.error(
        "DONATION ERROR:",
        submitError
      );

      setError(
        submitError.message ||
          "Unable to start the payment. Please try again."
      );

      setStatus("error");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | RESET
  |--------------------------------------------------------------------------
  */

  const resetDonation = () => {
    setAmount(500);
    setCustomAmount("");

    setPaymentMethod("mpesa");

    setPurpose(
      "Emergency Response"
    );

    setAnonymous(false);

    setStatus("idle");

    setError("");

    setDonation(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
    });
  };

  /*
  |--------------------------------------------------------------------------
  | SELECTED PAYMENT
  |--------------------------------------------------------------------------
  */

  const selectedPayment =
    PAYMENT_METHODS[
      paymentMethod
    ];

  const isProcessing =
    status === "processing";

  const isWaiting =
    status === "waiting";

  /*
  |--------------------------------------------------------------------------
  | SUCCESS SCREEN
  |--------------------------------------------------------------------------
  */

  if (status === "success") {
    return (
      <div className="min-h-screen bg-ems-dark flex items-center justify-center px-4 py-16">

        <div className="w-full max-w-2xl">

          <div className="bg-ems-card border border-ems-border rounded-3xl p-8 md:p-12 text-center">

            <div className="mx-auto w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">

              <FiCheckCircle
                className="text-green-400"
                size={40}
              />

            </div>

            <p className="text-green-400 text-sm font-semibold uppercase tracking-widest mt-8">
              Donation Successful
            </p>

            <h1 className="text-white text-3xl md:text-4xl font-bold mt-3">
              Thank You for Supporting EMS Kenya
            </h1>

            <p className="text-ems-muted mt-4 leading-relaxed">
              Your contribution of{" "}
              <span className="text-white font-semibold">
                KSh{" "}
                {donationAmount.toLocaleString()}
              </span>{" "}
              will help support emergency
              medical response and
              life-saving services across
              Kenya.
            </p>

            <div className="mt-8 p-5 rounded-2xl bg-ems-dark border border-ems-border text-left">

              <div className="flex justify-between gap-4 py-2">

                <span className="text-ems-muted text-sm">
                  Amount
                </span>

                <span className="text-white font-semibold">
                  KSh{" "}
                  {donationAmount.toLocaleString()}
                </span>

              </div>

              <div className="flex justify-between gap-4 py-2">

                <span className="text-ems-muted text-sm">
                  Purpose
                </span>

                <span className="text-white font-semibold text-sm">
                  {purpose}
                </span>

              </div>

              <div className="flex justify-between gap-4 py-2">

                <span className="text-ems-muted text-sm">
                  Payment
                </span>

                <span className="text-white font-semibold text-sm">
                  {selectedPayment.name}
                </span>

              </div>

              {paymentMethod ===
                "mpesa" &&
                donation?.mpesaReceiptNumber && (
                  <div className="flex justify-between gap-4 py-2">

                    <span className="text-ems-muted text-sm">
                      M-PESA Receipt
                    </span>

                    <span className="text-white font-semibold text-sm uppercase">
                      {
                        donation.mpesaReceiptNumber
                      }
                    </span>

                  </div>
                )}

            </div>

            <p className="text-ems-muted text-sm mt-6">
              Every second matters. Your
              support helps us respond when
              people need emergency care the
              most.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">

              <Link
                to="/"
                className="px-6 py-3 rounded-xl bg-emergency-red text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Return Home
              </Link>

              <button
                type="button"
                onClick={
                  resetDonation
                }
                className="px-6 py-3 rounded-xl border border-ems-border text-white font-semibold hover:bg-ems-dark transition-colors"
              >
                Make Another Donation
              </button>

            </div>

          </div>

        </div>

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | MAIN PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-ems-dark">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-ems-border">

        <div className="absolute inset-0 bg-emergency-red/5 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-ems-muted hover:text-white text-sm transition-colors"
          >
            <FiArrowLeft size={16} />
            Back to EMS Kenya
          </Link>

          <div className="max-w-3xl mt-10">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emergency-red/10 border border-emergency-red/20">

              <FiHeart
                className="text-emergency-red"
                size={14}
              />

              <span className="text-emergency-red text-xs font-semibold uppercase tracking-widest">
                Support Emergency Response
              </span>

            </div>

            <h1 className="text-white text-4xl md:text-6xl font-bold tracking-tight mt-6">

              Every Second

              <span className="text-emergency-red">
                {" "}
                Saves a Life.
              </span>

            </h1>

            <p className="text-ems-muted text-base md:text-lg leading-relaxed mt-6 max-w-2xl">
              Your donation helps EMS Kenya
              strengthen emergency response,
              support community EMTs, and help
              patients receive critical care when
              every second counts.
            </p>

          </div>

        </div>

      </section>

      {/* CONTENT */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT INFORMATION */}

          <div className="space-y-6">

            {/* WHY DONATE */}

            <div className="bg-ems-card border border-ems-border rounded-2xl p-6">

              <div className="w-11 h-11 rounded-xl bg-emergency-red/10 flex items-center justify-center">

                <FiHeart
                  className="text-emergency-red"
                  size={21}
                />

              </div>

              <h2 className="text-white font-bold text-xl mt-5">
                Your Support Matters
              </h2>

              <p className="text-ems-muted text-sm leading-relaxed mt-3">
                Donations help improve
                emergency response
                capabilities and support
                people working to save lives
                every day.
              </p>

              <div className="space-y-4 mt-7">

                <div className="flex gap-3">

                  <FiShield
                    className="text-emergency-red mt-0.5 flex-shrink-0"
                    size={18}
                  />

                  <div>

                    <p className="text-white text-sm font-semibold">
                      Secure Giving
                    </p>

                    <p className="text-ems-muted text-xs mt-1">
                      Payment information is
                      handled securely.
                    </p>

                  </div>

                </div>

                <div className="flex gap-3">

                  <FiSmartphone
                    className="text-emergency-red mt-0.5 flex-shrink-0"
                    size={18}
                  />

                  <div>

                    <p className="text-white text-sm font-semibold">
                      Three Payment Options
                    </p>

                    <p className="text-ems-muted text-xs mt-1">
                      M-PESA, KCB and Airtel
                      Money.
                    </p>

                  </div>

                </div>

                <div className="flex gap-3">

                  <FiHeart
                    className="text-emergency-red mt-0.5 flex-shrink-0"
                    size={18}
                  />

                  <div>

                    <p className="text-white text-sm font-semibold">
                      Help Save Lives
                    </p>

                    <p className="text-ems-muted text-xs mt-1">
                      Every contribution helps
                      strengthen emergency care.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* M-PESA DETAILS */}

            <div className="bg-ems-card border border-ems-border rounded-2xl p-6">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">

                  <FaMobileAlt
                    className="text-green-400"
                    size={19}
                  />

                </div>

                <div>

                  <p className="text-white font-semibold">
                    M-PESA
                  </p>

                  <p className="text-ems-muted text-xs">
                    Lipa na M-PESA
                  </p>

                </div>

              </div>

              <div className="mt-5 p-4 rounded-xl bg-ems-dark border border-ems-border">

                <p className="text-ems-muted text-xs uppercase tracking-wider">
                  PayBill
                </p>

                <p className="text-white text-2xl font-bold mt-1">
                  {MPESA_DETAILS.paybill}
                </p>

                <p className="text-ems-muted text-xs mt-3">
                  Account / Reference
                </p>

                <p className="text-white font-semibold text-sm mt-1">
                  {MPESA_DETAILS.account}
                </p>

              </div>

              <p className="text-ems-muted text-xs leading-relaxed mt-5">
                Select M-PESA below. Enter your
                phone number and an STK Push
                will be sent to your phone.
              </p>

            </div>

            {/* KCB DETAILS */}

            <div className="bg-ems-card border border-ems-border rounded-2xl p-6">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">

                  <FiCreditCard
                    className="text-blue-400"
                    size={19}
                  />

                </div>

                <div>

                  <p className="text-white font-semibold">
                    KCB Bank
                  </p>

                  <p className="text-ems-muted text-xs">
                    KCB payment
                  </p>

                </div>

              </div>

              <div className="mt-5 space-y-4">

                <div>

                  <p className="text-ems-muted text-xs">
                    Account Name
                  </p>

                  <p className="text-white text-sm font-semibold mt-1">
                    {KCB_DETAILS.accountName}
                  </p>

                </div>

                <div>

                  <p className="text-ems-muted text-xs">
                    Account Number
                  </p>

                  <p className="text-white text-sm font-semibold mt-1">
                    {KCB_DETAILS.accountNumber}
                  </p>

                </div>

              </div>

            </div>

            {/* AIRTEL DETAILS */}

            <div className="bg-ems-card border border-ems-border rounded-2xl p-6">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">

                  <FiSmartphone
                    className="text-red-400"
                    size={19}
                  />

                </div>

                <div>

                  <p className="text-white font-semibold">
                    Airtel Money
                  </p>

                  <p className="text-ems-muted text-xs">
                    Mobile payment
                  </p>

                </div>

              </div>

              <p className="text-ems-muted text-xs leading-relaxed mt-5">
                Select Airtel Money below,
                enter your Airtel number and
                follow the payment instructions.
              </p>

            </div>

          </div>

          {/* DONATION FORM */}

          <div className="lg:col-span-2">

            <form
              onSubmit={handleSubmit}
              className="bg-ems-card border border-ems-border rounded-3xl p-6 md:p-8"
            >

              <p className="text-emergency-red text-xs font-semibold uppercase tracking-widest">
                Make a Donation
              </p>

              <h2 className="text-white text-2xl md:text-3xl font-bold mt-2">
                Choose your contribution
              </h2>

              <p className="text-ems-muted text-sm mt-2">
                Select an amount and your
                preferred payment method.
              </p>

              {/* AMOUNT */}

              <div className="mt-7">

                <label className="text-white text-sm font-semibold">
                  Donation Amount
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">

                  {[100, 500, 1000, 5000].map(
                    (value) => (
                      <button
                        type="button"
                        key={value}
                        onClick={() => {
                          setAmount(value);
                          setCustomAmount("");
                          setError("");
                        }}
                        className={`py-3 rounded-xl border font-semibold text-sm transition-all ${
                          amount === value
                            ? "bg-emergency-red border-emergency-red text-white"
                            : "bg-ems-dark border-ems-border text-ems-muted hover:border-emergency-red hover:text-white"
                        }`}
                      >
                        KSh{" "}
                        {value.toLocaleString()}
                      </button>
                    )
                  )}

                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAmount("custom");
                    setError("");
                  }}
                  className={`w-full mt-3 py-3 rounded-xl border font-semibold text-sm transition-all ${
                    amount === "custom"
                      ? "bg-emergency-red border-emergency-red text-white"
                      : "bg-ems-dark border-ems-border text-ems-muted hover:border-emergency-red hover:text-white"
                  }`}
                >
                  Custom Amount
                </button>

                {amount === "custom" && (
                  <div className="mt-3 relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted text-sm">
                      KSh
                    </span>

                    <input
                      type="number"
                      min="10"
                      step="1"
                      value={customAmount}
                      onChange={(event) => {
                        setCustomAmount(
                          event.target.value
                        );
                        setError("");
                      }}
                      placeholder="Enter amount"
                      className="w-full bg-ems-dark border border-ems-border rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-ems-muted outline-none focus:border-emergency-red"
                    />

                  </div>
                )}

              </div>

              {/* PURPOSE */}

              <div className="mt-8">

                <label className="text-white text-sm font-semibold">
                  Donation Purpose
                </label>

                <select
                  value={purpose}
                  onChange={(event) =>
                    setPurpose(
                      event.target.value
                    )
                  }
                  className="w-full mt-3 bg-ems-dark border border-ems-border rounded-xl px-4 py-3 text-white outline-none focus:border-emergency-red"
                >

                  <option value="Ambulance">
                    Ambulance
                  </option>

                  <option value="Emergency Response">
                    Emergency Response
                  </option>

                  <option value="Community EMT">
                    Community EMT
                  </option>

                  <option value="General Support">
                    General Support
                  </option>

                </select>

              </div>

              {/* PAYMENT METHODS */}

              <div className="mt-8">

                <label className="text-white text-sm font-semibold">
                  Payment Method
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">

                  {/* M-PESA */}

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod(
                        "mpesa"
                      );
                      setError("");
                      setStatus("idle");
                    }}
                    className={`p-5 rounded-xl border text-left transition-all ${
                      paymentMethod === "mpesa"
                        ? "border-emergency-red bg-emergency-red/10"
                        : "border-ems-border bg-ems-dark hover:border-emergency-red/50"
                    }`}
                  >

                    <FaMobileAlt
                      className={
                        paymentMethod ===
                        "mpesa"
                          ? "text-green-400"
                          : "text-ems-muted"
                      }
                      size={23}
                    />

                    <p className="text-white font-semibold text-sm mt-3">
                      M-PESA
                    </p>

                    <p className="text-ems-muted text-xs mt-1">
                      STK Push
                    </p>

                  </button>

                  {/* KCB */}

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod(
                        "kcb"
                      );
                      setError("");
                      setStatus("idle");
                    }}
                    className={`p-5 rounded-xl border text-left transition-all ${
                      paymentMethod === "kcb"
                        ? "border-emergency-red bg-emergency-red/10"
                        : "border-ems-border bg-ems-dark hover:border-emergency-red/50"
                    }`}
                  >

                    <FiCreditCard
                      className={
                        paymentMethod ===
                        "kcb"
                          ? "text-blue-400"
                          : "text-ems-muted"
                      }
                      size={23}
                    />

                    <p className="text-white font-semibold text-sm mt-3">
                      KCB
                    </p>

                    <p className="text-ems-muted text-xs mt-1">
                      KCB payment
                    </p>

                  </button>

                  {/* AIRTEL */}

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod(
                        "airtel"
                      );
                      setError("");
                      setStatus("idle");
                    }}
                    className={`p-5 rounded-xl border text-left transition-all ${
                      paymentMethod ===
                      "airtel"
                        ? "border-emergency-red bg-emergency-red/10"
                        : "border-ems-border bg-ems-dark hover:border-emergency-red/50"
                    }`}
                  >

                    <FiSmartphone
                      className={
                        paymentMethod ===
                        "airtel"
                          ? "text-red-400"
                          : "text-ems-muted"
                      }
                      size={23}
                    />

                    <p className="text-white font-semibold text-sm mt-3">
                      Airtel Money
                    </p>

                    <p className="text-ems-muted text-xs mt-1">
                      Mobile payment
                    </p>

                  </button>

                </div>

              </div>

              {/* CUSTOMER INFORMATION */}

              <div className="mt-8">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <div>

                    <label className="text-white text-sm font-semibold">
                      Your Information
                    </label>

                    <p className="text-ems-muted text-xs mt-1">
                      Used for donation records
                      and payment confirmation.
                    </p>

                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">

                    <input
                      type="checkbox"
                      checked={anonymous}
                      onChange={(event) =>
                        setAnonymous(
                          event.target.checked
                        )
                      }
                      className="accent-red-600"
                    />

                    <span className="text-ems-muted text-xs">
                      Donate anonymously
                    </span>

                  </label>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

                  {/* NAME */}

                  <div className="relative">

                    <FiUser
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted"
                      size={17}
                    />

                    <input
                      type="text"
                      name="name"
                      value={
                        formData.name
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        anonymous
                      }
                      placeholder="Full name"
                      className="w-full bg-ems-dark border border-ems-border rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-ems-muted outline-none focus:border-emergency-red disabled:opacity-50"
                    />

                  </div>

                  {/* EMAIL */}

                  <div className="relative">

                    <FiMail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted"
                      size={17}
                    />

                    <input
                      type="email"
                      name="email"
                      value={
                        formData.email
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Email address"
                      className="w-full bg-ems-dark border border-ems-border rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-ems-muted outline-none focus:border-emergency-red"
                    />

                  </div>

                  {/* PHONE */}

                  <div className="relative md:col-span-2">

                    <FiPhone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted"
                      size={17}
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={
                        formData.phone
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="07XXXXXXXX or 2547XXXXXXXX"
                      className="w-full bg-ems-dark border border-ems-border rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-ems-muted outline-none focus:border-emergency-red"
                    />

                  </div>

                </div>

              </div>

              {/* PAYMENT INFORMATION */}

              <div className="mt-8 p-5 rounded-2xl bg-ems-dark border border-ems-border">

                <div className="flex gap-3">

                  <FiInfo
                    className="text-emergency-red mt-0.5 flex-shrink-0"
                    size={20}
                  />

                  <div className="flex-1">

                    <p className="text-white font-semibold">
                      {selectedPayment.name}
                    </p>

                    {/* MPESA */}

                    {paymentMethod ===
                      "mpesa" && (
                      <>
                        <p className="text-ems-muted text-xs leading-relaxed mt-2">
                          Click the donation
                          button and an M-PESA
                          STK Push will be sent
                          to your phone. Enter
                          your M-PESA PIN to
                          complete the payment.
                        </p>

                        <div className="grid grid-cols-2 gap-3 mt-4">

                          <div className="p-3 rounded-xl bg-ems-card border border-ems-border">

                            <p className="text-ems-muted text-[10px] uppercase tracking-wider">
                              PayBill
                            </p>

                            <p className="text-white font-bold mt-1">
                              {
                                MPESA_DETAILS.paybill
                              }
                            </p>

                          </div>

                          <div className="p-3 rounded-xl bg-ems-card border border-ems-border">

                            <p className="text-ems-muted text-[10px] uppercase tracking-wider">
                              Account
                            </p>

                            <p className="text-white font-bold mt-1">
                              {
                                MPESA_DETAILS.account
                              }
                            </p>

                          </div>

                        </div>
                      </>
                    )}

                    {/* KCB */}

                    {paymentMethod ===
                      "kcb" && (
                      <>
                        <p className="text-ems-muted text-xs leading-relaxed mt-2">
                          Your KCB payment request
                          will be submitted
                          securely. Follow the
                          instructions provided
                          by KCB to complete the
                          payment.
                        </p>

                        <div className="mt-4 p-4 rounded-xl bg-ems-card border border-ems-border">

                          <p className="text-ems-muted text-xs">
                            Account
                          </p>

                          <p className="text-white font-semibold mt-1">
                            {
                              KCB_DETAILS.accountName
                            }
                          </p>

                          <p className="text-ems-muted text-xs mt-2">
                            Account Number
                          </p>

                          <p className="text-white font-semibold mt-1">
                            {
                              KCB_DETAILS.accountNumber
                            }
                          </p>

                        </div>
                      </>
                    )}

                    {/* AIRTEL */}

                    {paymentMethod ===
                      "airtel" && (
                      <p className="text-ems-muted text-xs leading-relaxed mt-2">
                        Enter your Airtel Money
                        number above and submit
                        the donation. Follow the
                        Airtel Money instructions
                        to complete the payment.
                      </p>
                    )}

                  </div>

                </div>

              </div>

              {/* ERROR */}

              {error && (
                <div className="mt-6 flex gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20">

                  <FiAlertCircle
                    className="text-red-400 flex-shrink-0 mt-0.5"
                    size={18}
                  />

                  <p className="text-red-300 text-sm">
                    {error}
                  </p>

                </div>
              )}

              {/* WAITING */}

              {isWaiting && (
                <div className="mt-6 flex gap-3 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">

                  <FiLoader
                    className="text-yellow-400 flex-shrink-0 mt-0.5 animate-spin"
                    size={18}
                  />

                  <div>

                    <p className="text-white text-sm font-semibold">
                      Waiting for payment
                      confirmation
                    </p>

                    <p className="text-ems-muted text-xs mt-1">

                      {paymentMethod ===
                        "mpesa"
                        ? "Check your phone and enter your M-PESA PIN. We are waiting for Safaricom to confirm the transaction."
                        : `Complete your ${selectedPayment.name} payment and wait for confirmation.`}

                    </p>

                  </div>

                </div>
              )}

              {/* SUMMARY */}

              <div className="mt-8 p-5 rounded-2xl bg-ems-dark border border-ems-border">

                <div className="flex items-center justify-between gap-4">

                  <span className="text-ems-muted text-sm">
                    Donation
                  </span>

                  <span className="text-white font-bold text-xl">
                    KSh{" "}
                    {donationAmount.toLocaleString()}
                  </span>

                </div>

                <div className="flex items-center justify-between gap-4 mt-3">

                  <span className="text-ems-muted text-xs">
                    Purpose
                  </span>

                  <span className="text-white text-xs font-semibold">
                    {purpose}
                  </span>

                </div>

                <div className="flex items-center justify-between gap-4 mt-3">

                  <span className="text-ems-muted text-xs">
                    Payment
                  </span>

                  <span className="text-white text-xs font-semibold">
                    {
                      selectedPayment.name
                    }
                  </span>

                </div>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={
                  isProcessing ||
                  isWaiting
                }
                className="w-full mt-5 py-4 rounded-xl bg-emergency-red text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >

                {isProcessing ? (
                  <>
                    <FiLoader
                      size={17}
                      className="animate-spin"
                    />

                    Processing...
                  </>
                ) : isWaiting ? (
                  <>
                    <FiLoader
                      size={17}
                      className="animate-spin"
                    />

                    Waiting for payment...
                  </>
                ) : (
                  <>
                    <FiHeart size={17} />

                    Donate KSh{" "}
                    {donationAmount.toLocaleString()}{" "}
                    via{" "}
                    {
                      selectedPayment.name
                    }
                  </>
                )}

              </button>

              <p className="text-center text-ems-muted text-xs mt-4">
                By submitting this form, you
                confirm that the information
                provided is accurate.
              </p>

            </form>

          </div>

        </div>

      </main>

      {/* FOOTER MESSAGE */}

      <section className="border-t border-ems-border">

        <div className="max-w-5xl mx-auto px-4 py-16 text-center">

          <FiHeart
            className="mx-auto text-emergency-red"
            size={28}
          />

          <h2 className="text-white text-2xl md:text-3xl font-bold mt-5">
            Every Second Saves a Life.
          </h2>

          <p className="text-ems-muted max-w-2xl mx-auto mt-4 leading-relaxed">
            Thank you for standing with EMS
            Kenya. Together, we can help make
            emergency medical care faster,
            stronger, and more accessible to
            communities across Kenya.
          </p>

        </div>

      </section>

    </div>
  );
}