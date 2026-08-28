import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  FiInfo,
} from 'react-icons/fi';
import { FaMobileAlt } from 'react-icons/fa';

export default function Donate() {
  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [purpose, setPurpose] = useState('Emergency Response');
  const [anonymous, setAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    mpesaReference: '',
  });

  const donationAmount =
    amount === 'custom'
      ? Number(customAmount) || 0
      : amount;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (donationAmount < 10) {
      alert('Please enter a donation amount of at least KSh 10.');
      return;
    }

    if (!anonymous && !formData.name.trim()) {
      alert('Please enter your full name or select Anonymous Donation.');
      return;
    }

    if (!formData.phone.trim()) {
      alert('Please enter your phone number.');
      return;
    }

    if (
      paymentMethod === 'mpesa' &&
      !formData.mpesaReference.trim()
    ) {
      alert('Please enter your M-PESA confirmation/reference number.');
      return;
    }

    setSubmitted(true);
  };

  const resetDonation = () => {
    setAmount(500);
    setCustomAmount('');
    setPaymentMethod('mpesa');
    setPurpose('Emergency Response');
    setAnonymous(false);

    setFormData({
      name: '',
      email: '',
      phone: '',
      mpesaReference: '',
    });

    setSubmitted(false);
  };

  if (submitted) {
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

            <p className="text-emergency-red text-sm font-semibold uppercase tracking-widest mt-8">
              Donation Received
            </p>

            <h1 className="text-white text-3xl md:text-4xl font-bold mt-3">
              Thank You for Supporting EMS Kenya
            </h1>

            <p className="text-ems-muted mt-4 leading-relaxed">
              Your contribution of{' '}
              <span className="text-white font-semibold">
                KSh {donationAmount.toLocaleString()}
              </span>{' '}
              will help support emergency medical response and
              life-saving services across Kenya.
            </p>

            <div className="mt-8 p-5 rounded-2xl bg-ems-dark border border-ems-border text-left">

              <div className="flex justify-between gap-4 py-2">
                <span className="text-ems-muted text-sm">
                  Amount
                </span>

                <span className="text-white font-semibold">
                  KSh {donationAmount.toLocaleString()}
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
                  {paymentMethod === 'mpesa'
                    ? 'M-PESA'
                    : 'Bank Transfer'}
                </span>
              </div>

              {paymentMethod === 'mpesa' &&
                formData.mpesaReference && (
                  <div className="flex justify-between gap-4 py-2">
                    <span className="text-ems-muted text-sm">
                      M-PESA Reference
                    </span>

                    <span className="text-white font-semibold text-sm uppercase">
                      {formData.mpesaReference}
                    </span>
                  </div>
                )}

            </div>

            <p className="text-ems-muted text-sm mt-6">
              Every second matters. Your support helps us respond
              when people need emergency care the most.
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
                onClick={resetDonation}
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

  return (
    <div className="min-h-screen bg-ems-dark">

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
                {' '}
                Saves a Life.
              </span>
            </h1>

            <p className="text-ems-muted text-base md:text-lg leading-relaxed mt-6 max-w-2xl">
              Your donation helps EMS Kenya strengthen emergency
              response, support community EMTs, and help patients
              receive critical care when every second counts.
            </p>

          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-1 space-y-6">

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
                Donations help us improve emergency response
                capabilities and support the people who work to
                save lives every day.
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
                      Your donation information is handled securely.
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
                      M-PESA Friendly
                    </p>

                    <p className="text-ems-muted text-xs mt-1">
                      Convenient local payment through M-PESA.
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
                      Every contribution helps strengthen emergency
                      care.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="bg-ems-card border border-ems-border rounded-2xl p-6">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <FaMobileAlt
                    className="text-green-400"
                    size={18}
                  />
                </div>

                <div>
                  <p className="text-white font-semibold">
                    M-PESA Donation
                  </p>

                  <p className="text-ems-muted text-xs">
                    Lipa na M-PESA
                  </p>
                </div>

              </div>

              <div className="mt-5 p-4 rounded-xl bg-ems-dark border border-ems-border">

                <p className="text-ems-muted text-xs uppercase tracking-wider">
                  Paybill / Till Number
                </p>

                <p className="text-white text-2xl font-bold mt-1">
                  XXXXX
                </p>

                <p className="text-ems-muted text-xs mt-3">
                  Account / Reference
                </p>

                <p className="text-white font-semibold text-sm mt-1">
                  EMS DONATION
                </p>

              </div>

              <p className="text-ems-muted text-xs leading-relaxed mt-5">
                M-PESA → Lipa na M-PESA → PayBill/Till →
                enter the number above → enter your donation
                amount → use{' '}
                <span className="text-white font-medium">
                  EMS DONATION
                </span>{' '}
                as the reference.
              </p>

            </div>

            <div className="bg-ems-card border border-ems-border rounded-2xl p-6">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <FiCreditCard
                    className="text-blue-400"
                    size={18}
                  />
                </div>

                <div>
                  <p className="text-white font-semibold">
                    Bank Transfer
                  </p>

                  <p className="text-ems-muted text-xs">
                    Direct bank donation
                  </p>
                </div>

              </div>

              <div className="mt-5 space-y-3">

                <div>
                  <p className="text-ems-muted text-xs">
                    Bank
                  </p>

                  <p className="text-white text-sm font-semibold">
                    YOUR BANK NAME
                  </p>
                </div>

                <div>
                  <p className="text-ems-muted text-xs">
                    Account Name
                  </p>

                  <p className="text-white text-sm font-semibold">
                    EMS KENYA
                  </p>
                </div>

                <div>
                  <p className="text-ems-muted text-xs">
                    Account Number
                  </p>

                  <p className="text-white text-sm font-semibold">
                    XXXXXXXX
                  </p>
                </div>

                <div>
                  <p className="text-ems-muted text-xs">
                    Branch
                  </p>

                  <p className="text-white text-sm font-semibold">
                    YOUR BRANCH
                  </p>
                </div>

              </div>
            </div>

          </div>

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
                Select an amount or enter a custom contribution.
              </p>

              <div className="mt-7">

                <label className="text-white text-sm font-semibold">
                  Donation Amount
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">

                  {[100, 500, 1000, 5000].map((value) => (
                    <button
                      type="button"
                      key={value}
                      onClick={() => {
                        setAmount(value);
                        setCustomAmount('');
                      }}
                      className={`py-3 rounded-xl border font-semibold text-sm transition-all ${
                        amount === value
                          ? 'bg-emergency-red border-emergency-red text-white'
                          : 'bg-ems-dark border-ems-border text-ems-muted hover:border-emergency-red hover:text-white'
                      }`}
                    >
                      KSh {value.toLocaleString()}
                    </button>
                  ))}

                </div>

                <button
                  type="button"
                  onClick={() => setAmount('custom')}
                  className={`w-full mt-3 py-3 rounded-xl border font-semibold text-sm transition-all ${
                    amount === 'custom'
                      ? 'bg-emergency-red border-emergency-red text-white'
                      : 'bg-ems-dark border-ems-border text-ems-muted hover:border-emergency-red hover:text-white'
                  }`}
                >
                  Custom Amount
                </button>

                {amount === 'custom' && (
                  <div className="mt-3 relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted text-sm">
                      KSh
                    </span>

                    <input
                      type="number"
                      min="10"
                      value={customAmount}
                      onChange={(event) =>
                        setCustomAmount(event.target.value)
                      }
                      placeholder="Enter amount"
                      className="w-full bg-ems-dark border border-ems-border rounded-xl px-12 py-3 text-white placeholder:text-ems-muted outline-none focus:border-emergency-red"
                    />

                  </div>
                )}

              </div>

              <div className="mt-8">

                <label className="text-white text-sm font-semibold">
                  Donation Purpose
                </label>

                <select
                  value={purpose}
                  onChange={(event) =>
                    setPurpose(event.target.value)
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

              <div className="mt-8">

                <label className="text-white text-sm font-semibold">
                  Payment Method
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      paymentMethod === 'mpesa'
                        ? 'border-emergency-red bg-emergency-red/10'
                        : 'border-ems-border bg-ems-dark hover:border-emergency-red/50'
                    }`}
                  >

                    <div className="flex items-center gap-3">

                      <FaMobileAlt
                        className={
                          paymentMethod === 'mpesa'
                            ? 'text-emergency-red'
                            : 'text-ems-muted'
                        }
                        size={20}
                      />

                      <div>
                        <p className="text-white font-semibold text-sm">
                          M-PESA
                        </p>

                        <p className="text-ems-muted text-xs mt-1">
                          Pay via M-PESA
                        </p>
                      </div>

                    </div>

                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      paymentMethod === 'bank'
                        ? 'border-emergency-red bg-emergency-red/10'
                        : 'border-ems-border bg-ems-dark hover:border-emergency-red/50'
                    }`}
                  >

                    <div className="flex items-center gap-3">

                      <FiCreditCard
                        className={
                          paymentMethod === 'bank'
                            ? 'text-emergency-red'
                            : 'text-ems-muted'
                        }
                        size={20}
                      />

                      <div>
                        <p className="text-white font-semibold text-sm">
                          Bank Transfer
                        </p>

                        <p className="text-ems-muted text-xs mt-1">
                          Direct bank transfer
                        </p>
                      </div>

                    </div>

                  </button>

                </div>

              </div>

              <div className="mt-8">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <div>
                    <label className="text-white text-sm font-semibold">
                      Your Information
                    </label>

                    <p className="text-ems-muted text-xs mt-1">
                      Used for donation records and confirmation.
                    </p>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">

                    <input
                      type="checkbox"
                      checked={anonymous}
                      onChange={(event) =>
                        setAnonymous(event.target.checked)
                      }
                      className="accent-red-600"
                    />

                    <span className="text-ems-muted text-xs">
                      Donate anonymously
                    </span>

                  </label>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

                  <div className="relative">

                    <FiUser
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted"
                      size={17}
                    />

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={anonymous}
                      placeholder="Full name"
                      className="w-full bg-ems-dark border border-ems-border rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-ems-muted outline-none focus:border-emergency-red disabled:opacity-50"
                    />

                  </div>

                  <div className="relative">

                    <FiMail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted"
                      size={17}
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email address"
                      className="w-full bg-ems-dark border border-ems-border rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-ems-muted outline-none focus:border-emergency-red"
                    />

                  </div>

                  <div className="relative md:col-span-2">

                    <FiPhone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-ems-muted"
                      size={17}
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone number"
                      className="w-full bg-ems-dark border border-ems-border rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-ems-muted outline-none focus:border-emergency-red"
                    />

                  </div>

                </div>

              </div>

              {paymentMethod === 'mpesa' && (
                <div className="mt-8">

                  <label className="text-white text-sm font-semibold">
                    M-PESA Confirmation / Reference
                  </label>

                  <p className="text-ems-muted text-xs mt-1">
                    Enter the confirmation code from your M-PESA
                    message after completing your payment.
                  </p>

                  <input
                    type="text"
                    name="mpesaReference"
                    value={formData.mpesaReference}
                    onChange={handleChange}
                    placeholder="e.g. QAB123XYZ"
                    className="w-full mt-3 bg-ems-dark border border-ems-border rounded-xl px-4 py-3 text-white placeholder:text-ems-muted outline-none focus:border-emergency-red uppercase"
                  />

                </div>
              )}

              {paymentMethod === 'bank' && (
                <div className="mt-8 flex gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">

                  <FiInfo
                    className="text-blue-400 flex-shrink-0 mt-0.5"
                    size={18}
                  />

                  <p className="text-ems-muted text-xs leading-relaxed">
                    Please complete your bank transfer using the bank
                    details provided on this page. Keep your bank
                    transaction reference for your records.
                  </p>

                </div>
              )}

              <div className="mt-8 p-5 rounded-2xl bg-ems-dark border border-ems-border">

                <div className="flex items-center justify-between gap-4">

                  <span className="text-ems-muted text-sm">
                    Donation
                  </span>

                  <span className="text-white font-bold text-xl">
                    KSh {donationAmount.toLocaleString()}
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
                    {paymentMethod === 'mpesa'
                      ? 'M-PESA'
                      : 'Bank Transfer'}
                  </span>

                </div>

              </div>

              <button
                type="submit"
                className="w-full mt-5 py-4 rounded-xl bg-emergency-red text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <FiHeart size={17} />
                Donate KSh {donationAmount.toLocaleString()}
              </button>

              <p className="text-center text-ems-muted text-xs mt-4">
                By submitting this form, you confirm that the
                information provided is accurate.
              </p>

            </form>

          </div>
        </div>
      </main>

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
            Thank you for standing with EMS Kenya. Together, we can
            help make emergency medical care faster, stronger, and
            more accessible to communities across Kenya.
          </p>

        </div>

      </section>

    </div>
  );
}