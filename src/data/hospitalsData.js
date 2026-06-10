// Shared Kenya hospitals dataset — used in Hospitals.jsx, AdminHospitals.jsx, EMTDashboard.jsx
// Levels 3–6 across all 47 counties

export const HOSPITALS_DATA = [
  // ── NAIROBI COUNTY ──
  { _id: '1',   name: 'Kenyatta National Hospital',                         type: 'public',  level: 'level_6', county: 'Nairobi',        address: 'Hospital Road, Nairobi',              phone: '020 2726300', shaEmpanelled: true,  capabilities: { icu: true,  emergency: true, surgery: true, maternity: true  } },
  { _id: '2',   name: 'Kenyatta University Teaching & Referral Hospital',   type: 'public',  level: 'level_6', county: 'Nairobi',        address: 'Kahawa West, Nairobi',                phone: '020 2052000', shaEmpanelled: true,  capabilities: { icu: true,  emergency: true, surgery: true, maternity: true  } },
  { _id: '3',   name: 'Mathari National Teaching & Referral Hospital',      type: 'public',  level: 'level_6', county: 'Nairobi',        address: 'Mathare, Nairobi',                    phone: '020 2012811', shaEmpanelled: true,  capabilities: { emergency: true } },
  { _id: '4',   name: 'National Spinal Injury Referral Hospital',           type: 'public',  level: 'level_6', county: 'Nairobi',        address: 'Kilimani, Nairobi',                   phone: '020 2712684', shaEmpanelled: true,  capabilities: { surgery: true, emergency: true } },
  { _id: '5',   name: 'Nairobi Hospital',                                   type: 'private', level: 'level_5', county: 'Nairobi',        address: 'Argwings Kodhek Rd, Upper Hill',      phone: '020 2845000', shaEmpanelled: true,  capabilities: { icu: true,  emergency: true, surgery: true, maternity: true  } },
  { _id: '6',   name: 'Aga Khan University Hospital Nairobi',               type: 'private', level: 'level_5', county: 'Nairobi',        address: '3rd Parklands Ave, Parklands',        phone: '020 3662000', shaEmpanelled: false, capabilities: { icu: true,  emergency: true, surgery: true, dialysis: true   } },
  { _id: '7',   name: 'Coptic Hospital',                                    type: 'private', level: 'level_5', county: 'Nairobi',        address: 'Ngong Road, Nairobi',                 phone: '020 3877777', shaEmpanelled: false, capabilities: { icu: true,  emergency: true, surgery: true, maternity: true  } },
  { _id: '8',   name: "Gertrude's Children's Hospital",                     type: 'private', level: 'level_5', county: 'Nairobi',        address: 'Muthaiga, Nairobi',                   phone: '020 7206000', shaEmpanelled: false, capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '9',   name: 'Mbagathi County Referral Hospital',                  type: 'public',  level: 'level_5', county: 'Nairobi',        address: 'Golf Course Rd, Nairobi',             phone: '020 2012988', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '10',  name: 'Mater Misericordiae Hospital',                       type: 'mission', level: 'level_5', county: 'Nairobi',        address: 'Dunga Rd, Industrial Area',           phone: '020 6903000', shaEmpanelled: true,  capabilities: { icu: true,  emergency: true, surgery: true, maternity: true  } },
  { _id: '11',  name: 'MP Shah Hospital',                                   type: 'private', level: 'level_5', county: 'Nairobi',        address: 'Shivachi Rd, Parklands',              phone: '020 4291000', shaEmpanelled: true,  capabilities: { icu: true,  emergency: true, surgery: true  } },
  { _id: '12',  name: "Nairobi Women's Hospital",                           type: 'private', level: 'level_5', county: 'Nairobi',        address: 'Hurlingham, Nairobi',                 phone: '020 3803000', shaEmpanelled: true,  capabilities: { icu: true,  emergency: true, surgery: true, maternity: true  } },
  { _id: '13',  name: 'AAR Hospital Nairobi',                               type: 'private', level: 'level_5', county: 'Nairobi',        address: 'Westlands, Nairobi',                  phone: '020 4445000', shaEmpanelled: false, capabilities: { icu: true,  emergency: true, surgery: true  } },
  { _id: '14',  name: 'Mediheal Hospital Eastleigh',                        type: 'private', level: 'level_5', county: 'Nairobi',        address: 'Eastleigh, Nairobi',                  phone: '020 2150000', shaEmpanelled: true,  capabilities: { icu: true,  emergency: true, surgery: true, maternity: true  } },
  { _id: '15',  name: 'Nairobi East Hospital',                              type: 'private', level: 'level_5', county: 'Nairobi',        address: 'Eastleigh, Nairobi',                  phone: '020 2341000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '16',  name: 'Avenue Hospital Parklands',                          type: 'private', level: 'level_4', county: 'Nairobi',        address: 'Parklands Ave, Nairobi',              phone: '020 3749000', shaEmpanelled: false, capabilities: { emergency: true, surgery: true  } },
  { _id: '17',  name: 'Mama Lucy Kibaki Hospital',                          type: 'public',  level: 'level_4', county: 'Nairobi',        address: 'Eastlands, Nairobi',                  phone: '020 2341000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '18',  name: "St. Mary's Mission Hospital Nairobi",                type: 'mission', level: 'level_4', county: 'Nairobi',        address: "Lang'ata, Nairobi",                   phone: '020 3884000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '19',  name: 'Metropolitan Hospital',                              type: 'private', level: 'level_4', county: 'Nairobi',        address: 'Eastlands, Nairobi',                  phone: '020 2340000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true  } },
  { _id: '20',  name: 'Guru Nanak Ramgarhia Sikh Hospital',                 type: 'private', level: 'level_4', county: 'Nairobi',        address: 'Parklands, Nairobi',                  phone: '020 3744000', shaEmpanelled: false, capabilities: { emergency: true, surgery: true  } },
  { _id: '21',  name: 'Mariakani Cottage Hospital',                         type: 'private', level: 'level_4', county: 'Nairobi',        address: 'South B, Nairobi',                    phone: '020 2720000', shaEmpanelled: false, capabilities: { emergency: true, maternity: true  } },
  { _id: '22',  name: 'South B Hospital',                                   type: 'public',  level: 'level_4', county: 'Nairobi',        address: 'South B, Nairobi',                    phone: '020 2724000', shaEmpanelled: true,  capabilities: { emergency: true, maternity: true  } },
  { _id: '23',  name: 'Bristol Park Hospital Embakasi',                     type: 'private', level: 'level_4', county: 'Nairobi',        address: 'Embakasi, Nairobi',                   phone: '020 2003000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '24',  name: 'Meridian Equator Hospital',                          type: 'private', level: 'level_4', county: 'Nairobi',        address: 'Ngong Rd, Nairobi',                   phone: '020 3870000', shaEmpanelled: false, capabilities: { emergency: true, surgery: true  } },
  { _id: '25',  name: 'Jacaranda Maternity Clinic',                         type: 'private', level: 'level_3', county: 'Nairobi',        address: 'Westlands, Nairobi',                  phone: '020 4440000', shaEmpanelled: false, capabilities: { maternity: true  } },

  // ── MOMBASA COUNTY ──
  { _id: '26',  name: 'Coast General Teaching & Referral Hospital',         type: 'public',  level: 'level_5', county: 'Mombasa',        address: 'Hospital Rd, Mombasa',                phone: '041 2312191', shaEmpanelled: true,  capabilities: { icu: true,  emergency: true, surgery: true, maternity: true  } },
  { _id: '27',  name: 'Aga Khan Hospital Mombasa',                          type: 'private', level: 'level_5', county: 'Mombasa',        address: 'Vanga Rd, Mombasa',                   phone: '041 2227710', shaEmpanelled: false, capabilities: { icu: true,  emergency: true, surgery: true  } },
  { _id: '28',  name: 'Diani Beach Hospital',                               type: 'private', level: 'level_5', county: 'Kwale',          address: 'Diani, Kwale',                        phone: '040 3202000', shaEmpanelled: false, capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '29',  name: 'Mombasa Hospital',                                   type: 'private', level: 'level_4', county: 'Mombasa',        address: 'Mombasa Island',                      phone: '041 2224401', shaEmpanelled: false, capabilities: { emergency: true, surgery: true  } },
  { _id: '30',  name: 'Bomu Hospital',                                      type: 'mission', level: 'level_4', county: 'Mombasa',        address: 'Changamwe, Mombasa',                  phone: '041 3433000', shaEmpanelled: true,  capabilities: { emergency: true, maternity: true  } },
  { _id: '31',  name: 'Afya International Hospital Malindi',                type: 'private', level: 'level_4', county: 'Kilifi',         address: 'Malindi Town',                        phone: '042 2120000', shaEmpanelled: false, capabilities: { emergency: true, surgery: true  } },

  // ── UASIN GISHU ──
  { _id: '32',  name: 'Moi Teaching & Referral Hospital',                   type: 'public',  level: 'level_6', county: 'Uasin Gishu',   address: 'Nandi Rd, Eldoret',                   phone: '053 2063000', shaEmpanelled: true,  capabilities: { icu: true,  emergency: true, surgery: true, maternity: true, dialysis: true } },
  { _id: '33',  name: 'Mediheal Hospital Eldoret',                          type: 'private', level: 'level_6', county: 'Uasin Gishu',   address: 'Eldoret Town',                        phone: '053 2062000', shaEmpanelled: true,  capabilities: { icu: true,  emergency: true, surgery: true, maternity: true  } },
  { _id: '107', name: 'Eldoret Hospital',                                   type: 'private', level: 'level_4', county: 'Uasin Gishu',   address: 'Eldoret Town',                        phone: '053 2062100', shaEmpanelled: false, capabilities: { emergency: true, surgery: true  } },

  // ── KISUMU COUNTY ──
  { _id: '34',  name: 'Jaramogi Oginga Odinga Teaching & Referral Hospital',type: 'public',  level: 'level_5', county: 'Kisumu',         address: 'Kisumu Town',                         phone: '057 2024411', shaEmpanelled: true,  capabilities: { icu: true,  emergency: true, surgery: true, maternity: true  } },
  { _id: '35',  name: 'Aga Khan Hospital Kisumu',                           type: 'private', level: 'level_5', county: 'Kisumu',         address: 'Kisumu Town',                         phone: '057 2022093', shaEmpanelled: false, capabilities: { icu: true,  emergency: true, surgery: true  } },
  { _id: '36',  name: 'Maxcure Hospitals Kisumu',                           type: 'private', level: 'level_5', county: 'Kisumu',         address: 'Mega City Mall, Nairobi Rd',          phone: '057 2500000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '37',  name: "St. Joseph's Nyabondo Mission Hospital",             type: 'mission', level: 'level_5', county: 'Kisumu',         address: 'Nyabondo, Kisumu',                    phone: '057 2041000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '38',  name: 'Avenue Hospital Kisumu',                             type: 'private', level: 'level_4', county: 'Kisumu',         address: 'Kisumu Town',                         phone: '057 2025000', shaEmpanelled: false, capabilities: { emergency: true, surgery: true  } },
  { _id: '39',  name: 'Port Florence Hospital',                             type: 'private', level: 'level_4', county: 'Kisumu',         address: 'Kisumu, Lake Victoria',               phone: '057 2023000', shaEmpanelled: false, capabilities: { emergency: true, maternity: true  } },

  // ── NAKURU COUNTY ──
  { _id: '40',  name: 'Nakuru Level 6 Hospital',                            type: 'public',  level: 'level_6', county: 'Nakuru',         address: 'Nakuru Town',                         phone: '051 2212424', shaEmpanelled: true,  capabilities: { icu: true,  emergency: true, surgery: true, maternity: true  } },
  { _id: '41',  name: 'Pine Breeze Hospital Nakuru',                        type: 'private', level: 'level_5', county: 'Nakuru',         address: 'Nakuru Town',                         phone: '051 2211000', shaEmpanelled: false, capabilities: { emergency: true, surgery: true, maternity: true  } },

  // ── KISII COUNTY ──
  { _id: '42',  name: 'Kisii Teaching & Referral Hospital',                 type: 'public',  level: 'level_6', county: 'Kisii',          address: 'Kisii Town',                          phone: '058 2030601', shaEmpanelled: true,  capabilities: { icu: true,  emergency: true, surgery: true, maternity: true  } },
  { _id: '43',  name: 'Bosongo Hospital',                                   type: 'private', level: 'level_5', county: 'Kisii',          address: 'Kisii Town',                          phone: '058 2031000', shaEmpanelled: false, capabilities: { emergency: true, surgery: true, maternity: true  } },

  // ── KIAMBU COUNTY ──
  { _id: '44',  name: 'Kiambu County Referral Hospital',                    type: 'public',  level: 'level_5', county: 'Kiambu',         address: 'Kiambu Town',                         phone: '066 2022000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '45',  name: 'Thika Level 5 Hospital',                             type: 'public',  level: 'level_5', county: 'Kiambu',         address: 'Thika Town',                          phone: '067 2221000', shaEmpanelled: true,  capabilities: { icu: true,  emergency: true, surgery: true, maternity: true  } },
  { _id: '46',  name: 'Gatundu Level 5 Hospital',                           type: 'public',  level: 'level_5', county: 'Kiambu',         address: 'Gatundu, Kiambu',                     phone: '066 2540000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '47',  name: 'AIC Kijabe Hospital',                                type: 'mission', level: 'level_5', county: 'Kiambu',         address: 'Kijabe, Kiambu',                      phone: '066 3220000', shaEmpanelled: true,  capabilities: { icu: true,  emergency: true, surgery: true, maternity: true  } },
  { _id: '48',  name: 'Nazareth Hospital',                                  type: 'mission', level: 'level_5', county: 'Kiambu',         address: 'Limuru, Kiambu',                      phone: '066 7120000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '49',  name: 'P.C.E.A. Kikuyu Hospital',                           type: 'mission', level: 'level_5', county: 'Kiambu',         address: 'Kikuyu, Kiambu',                      phone: '066 2320000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '50',  name: 'Saint Bridget Hospital Kiambu',                      type: 'private', level: 'level_5', county: 'Kiambu',         address: 'Kiambu Town',                         phone: '066 2023000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '51',  name: 'Thika Nursing Home Hospital',                        type: 'private', level: 'level_5', county: 'Kiambu',         address: 'Thika Town',                          phone: '067 2222000', shaEmpanelled: false, capabilities: { emergency: true, maternity: true  } },

  // ── NYERI COUNTY ──
  { _id: '52',  name: 'Nyeri County Referral Hospital',                     type: 'public',  level: 'level_5', county: 'Nyeri',          address: 'Nyeri Town',                          phone: '061 2034600', shaEmpanelled: true,  capabilities: { icu: true,  emergency: true, surgery: true, maternity: true  } },
  { _id: '53',  name: 'Othaya Mwai Kibaki Teaching & Referral Hospital',    type: 'public',  level: 'level_5', county: 'Nyeri',          address: 'Othaya, Nyeri',                       phone: '061 2054000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '54',  name: 'Consolata Hospital Mathari',                         type: 'mission', level: 'level_4', county: 'Nyeri',          address: 'Nyeri Town',                          phone: '061 2030000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '55',  name: 'The Outspan Hospital',                               type: 'private', level: 'level_4', county: 'Nyeri',          address: 'Nyeri Town',                          phone: '061 2034500', shaEmpanelled: false, capabilities: { emergency: true, surgery: true  } },
  { _id: '56',  name: 'P.C.E.A. Tumutumu Hospital',                         type: 'mission', level: 'level_4', county: 'Nyeri',          address: 'Karatina, Nyeri',                     phone: '061 2052000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },

  // ── KIRINYAGA COUNTY ──
  { _id: '57',  name: 'Kerugoya County Referral Hospital',                  type: 'public',  level: 'level_5', county: 'Kirinyaga',      address: 'Kerugoya Town',                       phone: '060 2021000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },

  // ── THARAKA-NITHI ──
  { _id: '58',  name: 'PCEA Chogoria Hospital',                             type: 'mission', level: 'level_5', county: 'Tharaka-Nithi',  address: 'Chogoria, Tharaka-Nithi',             phone: '064 2020000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },

  // ── MURANG'A COUNTY ──
  { _id: '59',  name: "Murang'a County Referral Hospital",                  type: 'public',  level: 'level_5', county: "Murang'a",       address: "Murang'a Town",                       phone: '060 2030000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },

  // ── NYANDARUA COUNTY ──
  { _id: '60',  name: 'North Kinangop Catholic Hospital',                   type: 'mission', level: 'level_5', county: 'Nyandarua',      address: 'Kinangop, Nyandarua',                 phone: '060 2040000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },

  // ── EMBU COUNTY ──
  { _id: '61',  name: 'Embu Teaching & Referral Hospital',                  type: 'public',  level: 'level_5', county: 'Embu',           address: 'Embu Town',                           phone: '068 2311000', shaEmpanelled: true,  capabilities: { icu: true,  emergency: true, surgery: true, maternity: true  } },

  // ── MERU COUNTY ──
  { _id: '62',  name: 'Meru Teaching & Referral Hospital',                  type: 'public',  level: 'level_5', county: 'Meru',           address: 'North Imenti, Meru',                  phone: '064 2031000', shaEmpanelled: true,  capabilities: { icu: true,  emergency: true, surgery: true, maternity: true  } },
  { _id: '63',  name: 'Consolata Hospital Nkubu',                           type: 'mission', level: 'level_5', county: 'Meru',           address: 'Nkubu, Meru',                         phone: '064 2010000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '64',  name: 'Maua Methodist Hospital',                            type: 'mission', level: 'level_5', county: 'Meru',           address: 'Maua, Meru',                          phone: '064 2130000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },

  // ── MACHAKOS / MAKUENI / KITUI ──
  { _id: '65',  name: 'Machakos Level 5 Hospital',                          type: 'public',  level: 'level_5', county: 'Machakos',       address: 'Machakos Town',                       phone: '044 2021000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '66',  name: 'Makueni County Referral Hospital',                   type: 'public',  level: 'level_5', county: 'Makueni',        address: 'Wote, Makueni',                       phone: '044 4020000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '67',  name: 'Kitui County Referral Hospital',                     type: 'public',  level: 'level_5', county: 'Kitui',          address: 'Kitui Town',                          phone: '044 2220000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '68',  name: 'Our Lady of Lourdes Mutomo Hospital',                type: 'mission', level: 'level_5', county: 'Kitui',          address: 'Mutomo, Kitui',                       phone: '044 2230000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },

  // ── KAKAMEGA / WESTERN ──
  { _id: '69',  name: 'Kakamega County General Teaching & Referral Hospital',type: 'public', level: 'level_5', county: 'Kakamega',       address: 'Kakamega Town',                       phone: '056 2030320', shaEmpanelled: true,  capabilities: { icu: true,  emergency: true, surgery: true, maternity: true  } },
  { _id: '70',  name: 'Lifecare Hospitals Bungoma',                         type: 'private', level: 'level_5', county: 'Bungoma',        address: 'Bungoma Town',                        phone: '055 2030000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '71',  name: 'Vihiga County Referral Hospital',                    type: 'public',  level: 'level_5', county: 'Vihiga',         address: 'Maragoli, Vihiga',                    phone: '056 2410000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '72',  name: 'Friends Church Sabatia Eye Hospital',                type: 'mission', level: 'level_5', county: 'Vihiga',         address: 'Chavakali, Vihiga',                   phone: '056 2421000', shaEmpanelled: true,  capabilities: { surgery: true  } },
  { _id: '73',  name: 'Bungoma County Referral Hospital',                   type: 'public',  level: 'level_4', county: 'Bungoma',        address: 'Bungoma Town',                        phone: '055 2031000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '74',  name: 'Busia County Referral Hospital',                     type: 'public',  level: 'level_4', county: 'Busia',          address: 'Busia Town',                          phone: '055 2222000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '75',  name: 'Holy Family Nangina Mission Hospital',               type: 'mission', level: 'level_4', county: 'Busia',          address: 'Funyula, Busia',                      phone: '055 2223000', shaEmpanelled: true,  capabilities: { emergency: true, maternity: true  } },
  { _id: '76',  name: 'Jumuia Friends Hospital Kaimosi',                    type: 'mission', level: 'level_4', county: 'Vihiga',         address: 'Kaimosi, Vihiga',                     phone: '056 2411000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },

  // ── BOMET / RIFT VALLEY ──
  { _id: '77',  name: 'Tenwek Mission Hospital',                            type: 'mission', level: 'level_6', county: 'Bomet',          address: 'Bomet County',                        phone: '052 2020000', shaEmpanelled: true,  capabilities: { icu: true,  emergency: true, surgery: true, maternity: true  } },
  { _id: '78',  name: 'Narok County Referral Hospital',                     type: 'public',  level: 'level_4', county: 'Narok',          address: 'Narok Town',                          phone: '050 2022000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '79',  name: 'Nanyuki Teaching & Referral Hospital',               type: 'public',  level: 'level_5', county: 'Laikipia',       address: 'Nanyuki Town',                        phone: '062 2032000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },

  // ── HOMA BAY / MIGORI / SIAYA ──
  { _id: '80',  name: 'Homa Bay County Referral Hospital',                  type: 'public',  level: 'level_5', county: 'Homa Bay',       address: 'Homa Bay Town',                       phone: '059 2022000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '81',  name: 'Kendu Adventist Hospital',                           type: 'mission', level: 'level_4', county: 'Homa Bay',       address: 'Kendu Bay, Homa Bay',                 phone: '059 2030000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '82',  name: 'Migori County Referral Hospital',                    type: 'public',  level: 'level_5', county: 'Migori',         address: 'Migori Town',                         phone: '059 2060000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '83',  name: 'Siaya County Referral Hospital',                     type: 'public',  level: 'level_5', county: 'Siaya',          address: 'Siaya Town',                          phone: '057 2041000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },

  // ── MANDERA / NORTH EASTERN ──
  { _id: '84',  name: 'Mandera County Referral Hospital',                   type: 'public',  level: 'level_4', county: 'Mandera',        address: 'Mandera Town',                        phone: '046 2021000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '85',  name: 'Shamaal Hospital Mandera',                           type: 'private', level: 'level_5', county: 'Mandera',        address: 'Mandera Town',                        phone: '046 2022000', shaEmpanelled: false, capabilities: { emergency: true, maternity: true  } },
  { _id: '86',  name: 'Garissa County Referral Hospital',                   type: 'public',  level: 'level_5', county: 'Garissa',        address: 'Garissa Town',                        phone: '046 2031000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '87',  name: 'Wajir County Referral Hospital',                     type: 'public',  level: 'level_5', county: 'Wajir',          address: 'Wajir Town',                          phone: '046 2221000', shaEmpanelled: true,  capabilities: { emergency: true, maternity: true  } },

  // ── ISIOLO / MARSABIT / SAMBURU ──
  { _id: '88',  name: 'Isiolo County Referral Hospital',                    type: 'public',  level: 'level_5', county: 'Isiolo',         address: 'Isiolo Town',                         phone: '064 2020000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '89',  name: 'Galaxy Hospital Isiolo',                             type: 'private', level: 'level_5', county: 'Isiolo',         address: 'Isiolo Town',                         phone: '064 2021000', shaEmpanelled: false, capabilities: { emergency: true, maternity: true  } },
  { _id: '90',  name: 'Marsabit County Referral Hospital',                  type: 'public',  level: 'level_5', county: 'Marsabit',       address: 'Marsabit Town',                       phone: '069 2020000', shaEmpanelled: true,  capabilities: { emergency: true, maternity: true  } },
  { _id: '91',  name: 'Catholic Hospital Wamba',                            type: 'mission', level: 'level_4', county: 'Samburu',        address: 'Wamba, Samburu',                      phone: '065 2020000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '92',  name: 'Samburu County Referral Hospital',                   type: 'public',  level: 'level_5', county: 'Samburu',        address: 'Maralal, Samburu',                    phone: '065 2021000', shaEmpanelled: true,  capabilities: { emergency: true, maternity: true  } },

  // ── TRANS-NZOIA / WEST POKOT / ELGEYO-MARAKWET / BARINGO ──
  { _id: '93',  name: 'Kitale County Referral Hospital',                    type: 'public',  level: 'level_5', county: 'Trans-Nzoia',   address: 'Kitale Town',                         phone: '054 2031000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '94',  name: 'Kapenguria County Referral Hospital',                type: 'public',  level: 'level_5', county: 'West Pokot',    address: 'Kapenguria Town',                     phone: '054 2120000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '95',  name: 'Iten County Referral Hospital',                      type: 'public',  level: 'level_5', county: 'Elgeyo-Marakwet', address: 'Iten Town',                         phone: '053 2063100', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '96',  name: 'Baringo County Referral Hospital',                   type: 'public',  level: 'level_5', county: 'Baringo',        address: 'Kabarnet, Baringo',                   phone: '053 2212000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },

  // ── KERICHO / NANDI ──
  { _id: '97',  name: 'Kericho County Referral Hospital',                   type: 'public',  level: 'level_5', county: 'Kericho',        address: 'Kericho Town',                        phone: '052 2030000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '98',  name: 'Nandi Hills County Hospital',                        type: 'public',  level: 'level_4', county: 'Nandi',          address: 'Nandi Hills',                         phone: '053 2063200', shaEmpanelled: true,  capabilities: { emergency: true, maternity: true  } },

  // ── TURKANA ──
  { _id: '99',  name: 'Lodwar County Referral Hospital',                    type: 'public',  level: 'level_5', county: 'Turkana',        address: 'Lodwar, Turkana',                     phone: '054 2221000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },

  // ── LAMU / TANA RIVER / TAITA TAVETA ──
  { _id: '100', name: 'Hola County Referral Hospital',                      type: 'public',  level: 'level_5', county: 'Tana River',     address: 'Hola, Tana River',                    phone: '046 2060000', shaEmpanelled: true,  capabilities: { emergency: true, maternity: true  } },
  { _id: '101', name: 'Lamu County Referral Hospital',                      type: 'public',  level: 'level_5', county: 'Lamu',           address: 'Lamu Island',                         phone: '042 2633000', shaEmpanelled: true,  capabilities: { emergency: true, maternity: true  } },
  { _id: '102', name: 'Voi County Referral Hospital',                       type: 'public',  level: 'level_5', county: 'Taita Taveta',   address: 'Voi, Taita Taveta',                   phone: '043 2030000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },

  // ── KAJIADO ──
  { _id: '103', name: 'Kajiado County Referral Hospital',                   type: 'public',  level: 'level_5', county: 'Kajiado',        address: 'Kajiado Town',                        phone: '045 2021000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },

  // ── KWALE / KILIFI ──
  { _id: '104', name: 'Kwale County Referral Hospital',                     type: 'public',  level: 'level_5', county: 'Kwale',          address: 'Kwale Town',                          phone: '040 2020000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
  { _id: '105', name: 'Kilifi County Hospital',                             type: 'public',  level: 'level_5', county: 'Kilifi',         address: 'Kilifi Town',                         phone: '041 7522000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },

  // ── NYAMIRA ──
  { _id: '106', name: 'Nyamira County Referral Hospital',                   type: 'public',  level: 'level_5', county: 'Nyamira',        address: 'Nyamira Town',                        phone: '058 2040000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },

  // ── LAIKIPIA ──
  { _id: '108', name: 'Nyahururu County Referral Hospital',                 type: 'public',  level: 'level_4', county: 'Laikipia',       address: 'Nyahururu Town',                      phone: '065 2032000', shaEmpanelled: true,  capabilities: { emergency: true, surgery: true, maternity: true  } },
];

// Helpers consumed by multiple pages
export const LEVEL_LABEL = {
  level_2: 'Dispensary',
  level_3: 'Health Centre',
  level_4: 'Sub-County',
  level_5: 'County',
  level_6: 'National Referral',
};

export const EMERGENCY_HOSPITALS = HOSPITALS_DATA.filter(h => h.capabilities?.emergency);
