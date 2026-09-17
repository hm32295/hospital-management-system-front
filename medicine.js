 const categories = [
        {
            "name": "Alimentary Tract & Metabolism",
            "description": "Medicines affecting the digestive system and metabolism.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc48123699",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.924Z",
            "updatedAt": "2026-09-06T08:51:15.924Z"
        },
        {
            "name": "Antacids & Acid Suppressants",
            "description": "Medicines used to relieve excess stomach acid, heartburn, reflux, and related symptoms.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc4812369a",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.929Z",
            "updatedAt": "2026-09-06T08:51:15.929Z"
        },
        {
            "name": "Antiulcer Medicines",
            "description": "Medicines used in the treatment and prevention of peptic ulcers.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc4812369b",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.929Z",
            "updatedAt": "2026-09-06T08:51:15.929Z"
        },
        {
            "name": "Antiemetics",
            "description": "Medicines used to prevent or relieve nausea and vomiting.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc4812369c",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.930Z",
            "updatedAt": "2026-09-06T08:51:15.930Z"
        },
        {
            "name": "Antidiarrheals",
            "description": "Medicines used to relieve diarrhea and related intestinal symptoms.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc4812369d",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.930Z",
            "updatedAt": "2026-09-06T08:51:15.930Z"
        },
        {
            "name": "Laxatives",
            "description": "Medicines used to relieve constipation and facilitate bowel movements.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc4812369e",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.930Z",
            "updatedAt": "2026-09-06T08:51:15.930Z"
        },
        {
            "name": "Antispasmodics",
            "description": "Medicines used to relieve spasms and cramping of the gastrointestinal tract.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc4812369f",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.930Z",
            "updatedAt": "2026-09-06T08:51:15.930Z"
        },
        {
            "name": "Antiflatulents",
            "description": "Medicines used to relieve abdominal bloating and excessive intestinal gas.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236a0",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.931Z",
            "updatedAt": "2026-09-06T08:51:15.931Z"
        },
        {
            "name": "Digestive Enzymes",
            "description": "Preparations containing enzymes used to support digestion in selected conditions.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236a1",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.931Z",
            "updatedAt": "2026-09-06T08:51:15.931Z"
        },
        {
            "name": "Hepatobiliary Medicines",
            "description": "Medicines used for selected disorders of the liver, bile ducts, and gallbladder.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236a2",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.931Z",
            "updatedAt": "2026-09-06T08:51:15.931Z"
        },
        {
            "name": "Antidiabetic Medicines",
            "description": "Medicines used to control blood glucose in diabetes mellitus.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236a3",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.931Z",
            "updatedAt": "2026-09-06T08:51:15.931Z"
        },
        {
            "name": "Insulins",
            "description": "Insulin preparations used to control blood glucose in diabetes.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236a4",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.931Z",
            "updatedAt": "2026-09-06T08:51:15.931Z"
        },
        {
            "name": "Vitamins & Minerals",
            "description": "Vitamin and mineral preparations used to prevent or treat nutritional deficiencies.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236a5",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.931Z",
            "updatedAt": "2026-09-06T08:51:15.931Z"
        },
        {
            "name": "Blood & Blood Forming Organs",
            "description": "Medicines affecting blood formation, coagulation, and related disorders.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236a6",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.931Z",
            "updatedAt": "2026-09-06T08:51:15.931Z"
        },
        {
            "name": "Anticoagulants",
            "description": "Medicines used to reduce blood clot formation.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236a7",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.931Z",
            "updatedAt": "2026-09-06T08:51:15.931Z"
        },
        {
            "name": "Antiplatelet Medicines",
            "description": "Medicines that reduce platelet aggregation and help prevent arterial clot formation.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236a8",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.932Z",
            "updatedAt": "2026-09-06T08:51:15.932Z"
        },
        {
            "name": "Hemostatics",
            "description": "Medicines used to help control or prevent bleeding in specific clinical situations.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236a9",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.932Z",
            "updatedAt": "2026-09-06T08:51:15.932Z"
        },
        {
            "name": "Antianemic Medicines",
            "description": "Medicines and supplements used to prevent or treat anemia and nutritional deficiencies.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236aa",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.932Z",
            "updatedAt": "2026-09-06T08:51:15.932Z"
        },
        {
            "name": "Cardiovascular System",
            "description": "Medicines used to treat conditions affecting the heart and blood vessels.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236ab",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.932Z",
            "updatedAt": "2026-09-06T08:51:15.932Z"
        },
        {
            "name": "Antihypertensives",
            "description": "Medicines used to lower and control high blood pressure.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236ac",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.932Z",
            "updatedAt": "2026-09-06T08:51:15.932Z"
        },
        {
            "name": "Antianginal Medicines",
            "description": "Medicines used to prevent or relieve symptoms of angina pectoris.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236ad",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.932Z",
            "updatedAt": "2026-09-06T08:51:15.932Z"
        },
        {
            "name": "Antiarrhythmic Medicines",
            "description": "Medicines used to manage abnormal heart rhythms.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236ae",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.932Z",
            "updatedAt": "2026-09-06T08:51:15.932Z"
        },
        {
            "name": "Heart Failure Medicines",
            "description": "Medicines used as part of the treatment of heart failure.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236af",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.932Z",
            "updatedAt": "2026-09-06T08:51:15.932Z"
        },
        {
            "name": "Lipid-Lowering Medicines",
            "description": "Medicines used to reduce elevated cholesterol and other blood lipids.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236b0",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.932Z",
            "updatedAt": "2026-09-06T08:51:15.932Z"
        },
        {
            "name": "Diuretics",
            "description": "Medicines that increase urine production and are used in selected cardiovascular and fluid-retention conditions.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236b1",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.932Z",
            "updatedAt": "2026-09-06T08:51:15.932Z"
        },
        {
            "name": "Dermatological Medicines",
            "description": "Medicines and preparations used to treat disorders of the skin.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236b2",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.932Z",
            "updatedAt": "2026-09-06T08:51:15.932Z"
        },
        {
            "name": "Topical Anti-infectives",
            "description": "Medicines applied to the skin to treat or prevent selected infections.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236b3",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.932Z",
            "updatedAt": "2026-09-06T08:51:15.932Z"
        },
        {
            "name": "Topical Corticosteroids",
            "description": "Topical corticosteroid preparations used to reduce inflammation and itching in selected skin conditions.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236b4",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.933Z",
            "updatedAt": "2026-09-06T08:51:15.933Z"
        },
        {
            "name": "Emollients & Skin Protectives",
            "description": "Preparations used to moisturize, protect, and support the skin barrier.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236b5",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.933Z",
            "updatedAt": "2026-09-06T08:51:15.933Z"
        },
        {
            "name": "Acne Medicines",
            "description": "Medicines and topical preparations used in the management of acne.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236b6",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.933Z",
            "updatedAt": "2026-09-06T08:51:15.933Z"
        },
        {
            "name": "Antifungal Medicines",
            "description": "Medicines used to treat fungal infections.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236b7",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.933Z",
            "updatedAt": "2026-09-06T08:51:15.933Z"
        },
        {
            "name": "Antiviral Medicines",
            "description": "Medicines used to treat selected viral infections.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236b8",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.933Z",
            "updatedAt": "2026-09-06T08:51:15.933Z"
        },
        {
            "name": "Antibiotics",
            "description": "Antibacterial medicines used to treat susceptible bacterial infections.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236b9",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.933Z",
            "updatedAt": "2026-09-06T08:51:15.933Z"
        },
        {
            "name": "Antimicrobial Medicines",
            "description": "Medicines used to treat infections caused by microorganisms, including selected antibacterial and other antimicrobial agents.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236ba",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.933Z",
            "updatedAt": "2026-09-06T08:51:15.933Z"
        },
        {
            "name": "Antiseptics & Disinfectants",
            "description": "Products used to reduce or eliminate microorganisms on skin, wounds, or appropriate surfaces.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236bb",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.933Z",
            "updatedAt": "2026-09-06T08:51:15.933Z"
        },
        {
            "name": "Genitourinary System",
            "description": "Medicines used for disorders of the urinary and reproductive systems.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236bc",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.933Z",
            "updatedAt": "2026-09-06T08:51:15.933Z"
        },
        {
            "name": "Urinary Tract Medicines",
            "description": "Medicines used in selected urinary tract conditions and symptoms.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236bd",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.933Z",
            "updatedAt": "2026-09-06T08:51:15.933Z"
        },
        {
            "name": "Urological Medicines",
            "description": "Medicines used to manage selected urological disorders.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236be",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.933Z",
            "updatedAt": "2026-09-06T08:51:15.933Z"
        },
        {
            "name": "Gynecological Medicines",
            "description": "Medicines used for selected gynecological conditions.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236bf",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.933Z",
            "updatedAt": "2026-09-06T08:51:15.933Z"
        },
        {
            "name": "Hormonal Contraceptives",
            "description": "Hormonal medicines used for contraception.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236c0",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.933Z",
            "updatedAt": "2026-09-06T08:51:15.933Z"
        },
        {
            "name": "Respiratory System",
            "description": "Medicines used to treat diseases and symptoms affecting the respiratory system.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236c1",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.933Z",
            "updatedAt": "2026-09-06T08:51:15.933Z"
        },
        {
            "name": "Bronchodilators",
            "description": "Medicines that relax airway muscles and improve airflow in selected respiratory conditions.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236c2",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.933Z",
            "updatedAt": "2026-09-06T08:51:15.933Z"
        },
        {
            "name": "Asthma Medicines",
            "description": "Medicines used to control or relieve symptoms of asthma.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236c3",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.934Z",
            "updatedAt": "2026-09-06T08:51:15.934Z"
        },
        {
            "name": "COPD Medicines",
            "description": "Medicines used in the management of chronic obstructive pulmonary disease.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236c4",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.934Z",
            "updatedAt": "2026-09-06T08:51:15.934Z"
        },
        {
            "name": "Cough & Cold Medicines",
            "description": "Medicines used for symptomatic relief of cough, common cold, and related upper respiratory symptoms.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236c5",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.934Z",
            "updatedAt": "2026-09-06T08:51:15.934Z"
        },
        {
            "name": "Mucolytics & Expectorants",
            "description": "Medicines used to loosen mucus and facilitate clearance of respiratory secretions.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236c6",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.934Z",
            "updatedAt": "2026-09-06T08:51:15.934Z"
        },
        {
            "name": "Nasal Medicines",
            "description": "Medicines and preparations used for nasal congestion, rhinitis, and related conditions.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236c7",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.934Z",
            "updatedAt": "2026-09-06T08:51:15.934Z"
        },
        {
            "name": "Nervous System",
            "description": "Medicines used to treat disorders affecting the central and peripheral nervous systems.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236c8",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.934Z",
            "updatedAt": "2026-09-06T08:51:15.934Z"
        },
        {
            "name": "Analgesics",
            "description": "Medicines used to relieve pain.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236c9",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.934Z",
            "updatedAt": "2026-09-06T08:51:15.934Z"
        },
        {
            "name": "Antipyretics",
            "description": "Medicines used to reduce fever.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236ca",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.934Z",
            "updatedAt": "2026-09-06T08:51:15.934Z"
        },
        {
            "name": "NSAIDs",
            "description": "Non-steroidal anti-inflammatory medicines used for pain, inflammation, and fever in appropriate conditions.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236cb",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.934Z",
            "updatedAt": "2026-09-06T08:51:15.934Z"
        },
        {
            "name": "Opioid Analgesics",
            "description": "Opioid medicines used for moderate to severe pain under appropriate medical supervision.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236cc",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.934Z",
            "updatedAt": "2026-09-06T08:51:15.934Z"
        },
        {
            "name": "Antiepileptic Medicines",
            "description": "Medicines used to control and prevent epileptic seizures.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236cd",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.934Z",
            "updatedAt": "2026-09-06T08:51:15.934Z"
        },
        {
            "name": "Antidepressants",
            "description": "Medicines used to treat depressive disorders and selected other conditions.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236ce",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.934Z",
            "updatedAt": "2026-09-06T08:51:15.934Z"
        },
        {
            "name": "Antipsychotics",
            "description": "Medicines used in the treatment of psychotic disorders and selected psychiatric conditions.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236cf",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.934Z",
            "updatedAt": "2026-09-06T08:51:15.934Z"
        },
        {
            "name": "Anxiolytics",
            "description": "Medicines used to manage anxiety and related conditions.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236d0",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.934Z",
            "updatedAt": "2026-09-06T08:51:15.934Z"
        },
        {
            "name": "Sedatives & Hypnotics",
            "description": "Medicines used for sedation or management of selected sleep disorders.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236d1",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.934Z",
            "updatedAt": "2026-09-06T08:51:15.934Z"
        },
        {
            "name": "Antiparkinson Medicines",
            "description": "Medicines used to manage symptoms of Parkinson's disease.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236d2",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.934Z",
            "updatedAt": "2026-09-06T08:51:15.934Z"
        },
        {
            "name": "Muscle Relaxants",
            "description": "Medicines used to reduce muscle spasm in selected conditions.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236d3",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.934Z",
            "updatedAt": "2026-09-06T08:51:15.934Z"
        },
        {
            "name": "Migraine Medicines",
            "description": "Medicines used for the acute treatment or prevention of migraine.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236d4",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.934Z",
            "updatedAt": "2026-09-06T08:51:15.934Z"
        },
        {
            "name": "Eye Medicines",
            "description": "Medicines and preparations used to treat selected eye diseases and symptoms.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236d5",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.934Z",
            "updatedAt": "2026-09-06T08:51:15.934Z"
        },
        {
            "name": "Ophthalmic Anti-infectives",
            "description": "Eye preparations used to treat selected bacterial or other infectious eye conditions.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236d6",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.935Z",
            "updatedAt": "2026-09-06T08:51:15.935Z"
        },
        {
            "name": "Ophthalmic Anti-inflammatory Medicines",
            "description": "Eye preparations used to reduce inflammation in selected ocular conditions.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236d7",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.935Z",
            "updatedAt": "2026-09-06T08:51:15.935Z"
        },
        {
            "name": "Artificial Tears & Lubricants",
            "description": "Ophthalmic preparations used to relieve dryness and irritation of the eyes.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236d8",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.935Z",
            "updatedAt": "2026-09-06T08:51:15.935Z"
        },
        {
            "name": "Ear Medicines",
            "description": "Medicines and preparations used for selected ear conditions.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236d9",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.935Z",
            "updatedAt": "2026-09-06T08:51:15.935Z"
        },
        {
            "name": "ENT Medicines",
            "description": "Medicines used for selected ear, nose, and throat conditions.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236da",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.935Z",
            "updatedAt": "2026-09-06T08:51:15.935Z"
        },
        {
            "name": "Antihistamines",
            "description": "Medicines used to relieve allergy symptoms such as itching, sneezing, and runny nose.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236db",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.935Z",
            "updatedAt": "2026-09-06T08:51:15.935Z"
        },
        {
            "name": "Allergy Medicines",
            "description": "Medicines used to manage allergic conditions and their symptoms.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236dc",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.935Z",
            "updatedAt": "2026-09-06T08:51:15.935Z"
        },
        {
            "name": "Corticosteroids",
            "description": "Corticosteroid medicines used to reduce inflammation and modify immune responses in selected conditions.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236dd",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.935Z",
            "updatedAt": "2026-09-06T08:51:15.935Z"
        },
        {
            "name": "Immunosuppressants",
            "description": "Medicines that suppress immune activity and are used in selected autoimmune and transplant-related conditions.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236de",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.935Z",
            "updatedAt": "2026-09-06T08:51:15.935Z"
        },
        {
            "name": "Antineoplastic Medicines",
            "description": "Medicines used in the treatment of cancer.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236df",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.935Z",
            "updatedAt": "2026-09-06T08:51:15.935Z"
        },
        {
            "name": "Targeted Cancer Therapies",
            "description": "Medicines designed to act on specific molecular targets involved in cancer.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236e0",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.935Z",
            "updatedAt": "2026-09-06T08:51:15.935Z"
        },
        {
            "name": "Hormonal Anticancer Medicines",
            "description": "Hormonal medicines used in the treatment of selected hormone-sensitive cancers.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236e1",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.935Z",
            "updatedAt": "2026-09-06T08:51:15.935Z"
        },
        {
            "name": "Endocrine System Medicines",
            "description": "Medicines used for disorders of endocrine glands and hormone regulation.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236e2",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.935Z",
            "updatedAt": "2026-09-06T08:51:15.935Z"
        },
        {
            "name": "Thyroid Medicines",
            "description": "Medicines used to treat hypothyroidism, hyperthyroidism, and selected thyroid disorders.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236e3",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.935Z",
            "updatedAt": "2026-09-06T08:51:15.935Z"
        },
        {
            "name": "Corticosteroid Systemic Medicines",
            "description": "Systemic corticosteroids used for selected inflammatory, allergic, autoimmune, and other conditions.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236e4",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.935Z",
            "updatedAt": "2026-09-06T08:51:15.935Z"
        },
        {
            "name": "Musculoskeletal System",
            "description": "Medicines used for disorders of bones, joints, muscles, and connective tissues.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236e5",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.935Z",
            "updatedAt": "2026-09-06T08:51:15.935Z"
        },
        {
            "name": "Anti-rheumatic Medicines",
            "description": "Medicines used in the management of inflammatory and rheumatic diseases.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236e6",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.935Z",
            "updatedAt": "2026-09-06T08:51:15.935Z"
        },
        {
            "name": "Gout Medicines",
            "description": "Medicines used to treat acute gout attacks or reduce uric acid levels.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236e7",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.935Z",
            "updatedAt": "2026-09-06T08:51:15.935Z"
        },
        {
            "name": "Osteoporosis Medicines",
            "description": "Medicines used to prevent or treat loss of bone density and osteoporosis.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236e8",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.935Z",
            "updatedAt": "2026-09-06T08:51:15.935Z"
        },
        {
            "name": "Antiprotozoal Medicines",
            "description": "Medicines used to treat selected infections caused by protozoa.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236e9",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.935Z",
            "updatedAt": "2026-09-06T08:51:15.935Z"
        },
        {
            "name": "Anthelmintics",
            "description": "Medicines used to treat infections caused by parasitic worms.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236ea",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.935Z",
            "updatedAt": "2026-09-06T08:51:15.935Z"
        },
        {
            "name": "Antimalarial Medicines",
            "description": "Medicines used to prevent or treat malaria.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236eb",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.936Z",
            "updatedAt": "2026-09-06T08:51:15.936Z"
        },
        {
            "name": "Antiretroviral Medicines",
            "description": "Medicines used in combination regimens for the treatment of HIV infection.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236ec",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.936Z",
            "updatedAt": "2026-09-06T08:51:15.936Z"
        },
        {
            "name": "Vaccines & Immunological Products",
            "description": "Vaccines and selected immunological products used for prevention or management of specific diseases.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236ed",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.936Z",
            "updatedAt": "2026-09-06T08:51:15.936Z"
        },
        {
            "name": "Local Anesthetics",
            "description": "Medicines used to produce localized loss of sensation during selected procedures.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236ee",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.936Z",
            "updatedAt": "2026-09-06T08:51:15.936Z"
        },
        {
            "name": "General Anesthetics",
            "description": "Medicines used to produce general anesthesia during surgical and other procedures.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236ef",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.936Z",
            "updatedAt": "2026-09-06T08:51:15.936Z"
        },
        {
            "name": "Emergency Medicines",
            "description": "Medicines commonly used in emergency and acute-care situations.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236f0",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.936Z",
            "updatedAt": "2026-09-06T08:51:15.936Z"
        },
        {
            "name": "Critical Care Medicines",
            "description": "Medicines used in intensive and critical care settings.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236f1",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.936Z",
            "updatedAt": "2026-09-06T08:51:15.936Z"
        },
        {
            "name": "Medical Gases",
            "description": "Gases used for medical treatment, respiratory support, anesthesia, or diagnostic purposes.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236f2",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.936Z",
            "updatedAt": "2026-09-06T08:51:15.936Z"
        },
        {
            "name": "Smoking Cessation Medicines",
            "description": "Medicines and therapeutic products used to support smoking cessation.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236f3",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.936Z",
            "updatedAt": "2026-09-06T08:51:15.936Z"
        },
        {
            "name": "Nutritional Preparations",
            "description": "Oral or specialized nutritional products used to support nutritional needs.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236f4",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.936Z",
            "updatedAt": "2026-09-06T08:51:15.936Z"
        },
        {
            "name": "Oral & Dental Care",
            "description": "Medicines and preparations used for selected oral, dental, and gum conditions.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236f5",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.936Z",
            "updatedAt": "2026-09-06T08:51:15.936Z"
        },
        {
            "name": "Mouth & Throat Preparations",
            "description": "Preparations used to relieve symptoms and treat selected conditions of the mouth and throat.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236f6",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.936Z",
            "updatedAt": "2026-09-06T08:51:15.936Z"
        },
        {
            "name": "Pediatric Medicines",
            "description": "Medicines and formulations intended or commonly used for pediatric patients.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236f7",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.936Z",
            "updatedAt": "2026-09-06T08:51:15.936Z"
        },
        {
            "name": "Geriatric Medicines",
            "description": "Medicines and preparations commonly considered in the care of older adults.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236f8",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.936Z",
            "updatedAt": "2026-09-06T08:51:15.936Z"
        },
        {
            "name": "Obstetric Medicines",
            "description": "Medicines used in selected conditions related to pregnancy, labor, and the postpartum period.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236f9",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.936Z",
            "updatedAt": "2026-09-06T08:51:15.936Z"
        },
        {
            "name": "Smoking & Nicotine Dependence",
            "description": "Therapeutic products used in programs for nicotine dependence and smoking cessation.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236fa",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.936Z",
            "updatedAt": "2026-09-06T08:51:15.936Z"
        },
        {
            "name": "Diagnostic Agents",
            "description": "Medicinal or pharmaceutical agents used to support specific diagnostic procedures.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236fb",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.937Z",
            "updatedAt": "2026-09-06T08:51:15.937Z"
        },
        {
            "name": "Contrast Media",
            "description": "Agents used to enhance medical imaging examinations.",
            "isActive": true,
            "_id": "6a9d2983511ce8cc481236fc",
            "__v": 0,
            "createdAt": "2026-09-06T08:51:15.937Z",
            "updatedAt": "2026-09-06T08:51:15.937Z"
        }
    ]
const medicine = [
  {
    "name": "AKNAPALEN 1% TOPICAL GEL 25 GM",
    "genericName": "ADAPALENE",
    "category": "Acne Medicines",
    "manufacturer": "EGPI",
    "description": "Pharmaceutical product containing ADAPALENE, classified under acne medicines."
  },
  {
    "name": "AKNEMYCIN 2% OINT. 15 GM (N/A)",
    "genericName": "ERYTHROMYCIN",
    "category": "Antibiotics",
    "manufacturer": "MUP > HERMAL-GERMANY",
    "description": "Pharmaceutical product containing ERYTHROMYCIN, classified under antibiotics."
  },
  {
    "name": "AKNEMYCIN 2% SOLUTION 25 ML (N/A)",
    "genericName": "ERYTHROMYCIN",
    "category": "Antibiotics",
    "manufacturer": "MUP > HERMAL-GERMANY",
    "description": "Pharmaceutical product containing ERYTHROMYCIN, classified under antibiotics."
  },
  {
    "name": "AKNEROXID-5 5% GEL 20 GM",
    "genericName": "BENZOYL PEROXIDE",
    "category": "Acne Medicines",
    "manufacturer": "MUP > HERMAL-GERMANY",
    "description": "Pharmaceutical product containing BENZOYL PEROXIDE, classified under acne medicines."
  },
  {
    "name": "AKTOCAL SUSPENSION 120 ML",
    "genericName": "CALCIUM+MAGNESIUM+ZINC+PHOSPHORUS+VITAMIN D3",
    "category": "Vitamins & Minerals",
    "manufacturer": "ORGANIX > GENERICA PHARMA",
    "description": "Pharmaceutical product containing CALCIUM+MAGNESIUM+ZINC+PHOSPHORUS+VITAMIN D3, classified under vitamins and minerals."
  },
  {
    "name": "AKYNZEO 300/0.5 MG 1 CAPS.",
    "genericName": "NETUPITANT+PALONOSETRON",
    "category": "Antiemetics",
    "manufacturer": "HELSINN > MUNDIPHARMA",
    "description": "Pharmaceutical product containing NETUPITANT+PALONOSETRON, classified under antiemetics."
  },
  {
    "name": "ALAMBUPHINE 20MG/2ML 5 AMP.",
    "genericName": "NALBUPHINE",
    "category": "Opioid Analgesics",
    "manufacturer": "AMRIYA",
    "description": "Pharmaceutical product containing NALBUPHINE, classified under opioid analgesics."
  },
  {
    "name": "ALAPOM 20 TABLETS",
    "genericName": "ALPHA-LIPOIC ACID+NERVONIC ACID+BLUEBERRY FRUIT EXTRACT+D-ALPHA-TOCOPHERYL ACETATE+ZINC GLUCONATE+NICOTINAMIDE+PYRIDOXINE HYDROCHLORIDE+SODIUM SELENITE+METHYLCOBALAMIN",
    "category": "Nervous System",
    "manufacturer": "COPAD EGYPT > COPAD PHARMA",
    "description": "Pharmaceutical product classified under nervous system medicines."
  },
  {
    "name": "ALASKA 20 CAPS.",
    "genericName": "PURE FISH OIL+EPA+DHA+E1",
    "category": "Nutritional Preparations",
    "manufacturer": "> TECHNOPHARM",
    "description": "Pharmaceutical product containing PURE FISH OIL+EPA+DHA+E1, classified under nutritional preparations."
  },
  {
    "name": "ALBA 20 CAPS",
    "genericName": "FERROUS BISGLYCINATE+ASCORBIC ACID+METHYLCOBALAMIN (B12)+VITAMIN B3+VITAMIN B1+VITAMIN B2+COPPER+FOLATE",
    "category": "Antianemic Medicines",
    "manufacturer": "ORGANIX FOR FOOD SUPPLEMENTS > MEDCARE PHARMACEUTICALS",
    "description": "Pharmaceutical product containing iron and vitamins, classified under antianemic medicines."
  },
  {
    "name": "ALBA IRON & ZINC 20 CHEW. TABS.",
    "genericName": "IRON+ZINC",
    "category": "Antianemic Medicines",
    "manufacturer": "MEDCARE",
    "description": "Pharmaceutical product containing IRON+ZINC, classified under antianemic medicines."
  },
  {
    "name": "ALBAPURE 20% 50ML I.V.INFUSION (N/A)",
    "genericName": "HUMAN ALBUMIN",
    "category": "Blood & Blood Forming Organs",
    "manufacturer": "CSL BEHRING AG > 2S PHARMA GROUP",
    "description": "Pharmaceutical product containing HUMAN ALBUMIN, classified under blood and blood forming organs."
  },
  {
    "name": "ALBENDAZOLE 200MG/5ML SUSP. 30ML",
    "genericName": "ALBENDAZOLE",
    "category": "Anthelmintics",
    "manufacturer": "PHARMA CURE PHARMACEUTICALS > PHARMA CURE",
    "description": "Pharmaceutical product containing ALBENDAZOLE, classified under anthelmintics."
  },
  {
    "name": "ALBENDAZOLE 400 MG 6 TABS",
    "genericName": "ALBENDAZOLE",
    "category": "Anthelmintics",
    "manufacturer": "PHARMA CURE PHARMACEUTICALS > PHARMA CURE",
    "description": "Pharmaceutical product containing ALBENDAZOLE, classified under anthelmintics."
  },
  {
    "name": "ALBOTHYL 1.8% VAG. JEL 40 GM (N/A)",
    "genericName": "POLICRESULEN",
    "category": "Gynecological Medicines",
    "manufacturer": "AUG PHARMA",
    "description": "Pharmaceutical product containing POLICRESULEN, classified under gynecological medicines."
  },
  {
    "name": "ALBOTHYL 90MG 8 VAG. SUPP.",
    "genericName": "POLICRESULEN",
    "category": "Gynecological Medicines",
    "manufacturer": "AUG PHARMA",
    "description": "Pharmaceutical product containing POLICRESULEN, classified under gynecological medicines."
  },
  {
    "name": "ALBUNORM 20% I.V.INFUSION",
    "genericName": "HUMAN ALBUMIN",
    "category": "Blood & Blood Forming Organs",
    "manufacturer": "OCTAPHARMA > PHARMA OVER SEAS",
    "description": "Pharmaceutical product containing HUMAN ALBUMIN, classified under blood and blood forming organs."
  },
  {
    "name": "ALBUSTIX 16 MG 30 TABS.",
    "genericName": "CANDESARTAN CILEXETIL",
    "category": "Antihypertensives",
    "manufacturer": "FUTURE PHARMACEUTICAL INDUSTRIES > CONCORD PHARMACEUTICAL INDUSTRIES",
    "description": "Pharmaceutical product containing CANDESARTAN CILEXETIL, classified under antihypertensives."
  },
  {
    "name": "ALBUSTIX 32 MG 30 TABS.",
    "genericName": "CANDESARTAN CILEXETIL",
    "category": "Antihypertensives",
    "manufacturer": "FUTURE PHARMACEUTICAL INDUSTRIES > CONCORD PHARMACEUTICAL INDUSTRIES",
    "description": "Pharmaceutical product containing CANDESARTAN CILEXETIL, classified under antihypertensives."
  },
  {
    "name": "ALBUSTIX 4 MG 30 TABS.",
    "genericName": "CANDESARTAN CILEXETIL",
    "category": "Antihypertensives",
    "manufacturer": "FUTURE PHARMACEUTICAL INDUSTRIES > CONCORD PHARMACEUTICAL INDUSTRIES",
    "description": "Pharmaceutical product containing CANDESARTAN CILEXETIL, classified under antihypertensives."
  },
  {
    "name": "ALBUSTIX 8 MG 30 TABS.",
    "genericName": "CANDESARTAN CILEXETIL",
    "category": "Antihypertensives",
    "manufacturer": "FUTURE PHARMACEUTICAL INDUSTRIES > CONCORD PHARMACEUTICAL INDUSTRIES",
    "description": "Pharmaceutical product containing CANDESARTAN CILEXETIL, classified under antihypertensives."
  },
  {
    "name": "ALBUSTIX D 16/12.5MG 30 TABS.",
    "genericName": "CANDESARTAN CILEXETIL+HYDROCHLOROTHIAZIDE",
    "category": "Antihypertensives",
    "manufacturer": "FUTURE PHARMACEUTICAL INDUSTRIES > CONCORD PHARMACEUTICAL INDUSTRIES",
    "description": "Pharmaceutical product containing CANDESARTAN CILEXETIL+HYDROCHLOROTHIAZIDE, classified under antihypertensives."
  },
  {
    "name": "ALBUSTIX D 32/12.5MG 30 TABS.",
    "genericName": "CANDESARTAN CILEXETIL+HYDROCHLOROTHIAZIDE",
    "category": "Antihypertensives",
    "manufacturer": "FUTURE PHARMACEUTICAL INDUSTRIES > CONCORD PHARMACEUTICAL INDUSTRIES",
    "description": "Pharmaceutical product containing CANDESARTAN CILEXETIL+HYDROCHLOROTHIAZIDE, classified under antihypertensives."
  },
  {
    "name": "ALBUSTIX D 32/25MG 30 TABS.",
    "genericName": "CANDESARTAN CILEXETIL+HYDROCHLOROTHIAZIDE",
    "category": "Antihypertensives",
    "manufacturer": "FUTURE PHARMACEUTICAL INDUSTRIES > CONCORD PHARMACEUTICAL INDUSTRIES",
    "description": "Pharmaceutical product containing CANDESARTAN CILEXETIL+HYDROCHLOROTHIAZIDE, classified under antihypertensives."
  },
  {
    "name": "ALBUSTIX D 8/12.5MG 30 TABS.",
    "genericName": "CANDESARTAN CILEXETIL+HYDROCHLOROTHIAZIDE",
    "category": "Antihypertensives",
    "manufacturer": "FUTURE PHARMACEUTICAL INDUSTRIES > CONCORD PHARMACEUTICAL INDUSTRIES",
    "description": "Pharmaceutical product containing CANDESARTAN CILEXETIL+HYDROCHLOROTHIAZIDE, classified under antihypertensives."
  },
  {
    "name": "ALBUTEIN 20% I.V. INFUSION",
    "genericName": "HUMAN ALBUMIN",
    "category": "Blood & Blood Forming Organs",
    "manufacturer": "GRIFOLS BIOLOGICAL INC.-USA > EGYPTIAN PHARMEX",
    "description": "Pharmaceutical product containing HUMAN ALBUMIN, classified under blood and blood forming organs."
  },
  {
    "name": "ALCAFTAPRO 0.25% EYE DROPS 3 ML",
    "genericName": "ALCAFTADINE",
    "category": "Antihistamines",
    "manufacturer": "EVA PHARMA",
    "description": "Pharmaceutical product containing ALCAFTADINE, classified under antihistamines."
  },
  {
    "name": "ALCOFAN 100 MG 5 SUPP.",
    "genericName": "KETOPROFEN",
    "category": "NSAIDs",
    "manufacturer": "ALEXANDRIA",
    "description": "Pharmaceutical product containing KETOPROFEN, classified under NSAIDs."
  },
  {
    "name": "ALCOFAN 2.5% GEL 30 GM",
    "genericName": "KETOPROFEN",
    "category": "NSAIDs",
    "manufacturer": "ALEXANDRIA",
    "description": "Pharmaceutical product containing KETOPROFEN, classified under NSAIDs."
  },
  {
    "name": "ALCOFAN 25 MG 20 TABS.",
    "genericName": "KETOPROFEN",
    "category": "NSAIDs",
    "manufacturer": "ALEXANDRIA",
    "description": "Pharmaceutical product containing KETOPROFEN, classified under NSAIDs."
  },
  {
    "name": "ALCOFAN 50 MG 12 CAPS.",
    "genericName": "KETOPROFEN",
    "category": "NSAIDs",
    "manufacturer": "ALEXANDRIA",
    "description": "Pharmaceutical product containing KETOPROFEN, classified under NSAIDs."
  },
  {
    "name": "ALDACTAZIDE 20 TAB",
    "genericName": "HYDROCHLOROTHIAZIDE+SPIRONOLACTONE",
    "category": "Diuretics",
    "manufacturer": "KAHIRA > SEARLE-CANADA",
    "description": "Pharmaceutical product containing HYDROCHLOROTHIAZIDE+SPIRONOLACTONE, classified under diuretics."
  },
  {
    "name": "ALDACTONE 100MG 20 TAB",
    "genericName": "SPIRONOLACTONE",
    "category": "Diuretics",
    "manufacturer": "KAHIRA > SEARLE-CANADA",
    "description": "Pharmaceutical product containing SPIRONOLACTONE, classified under diuretics."
  },
  {
    "name": "ALDACTONE 25MG 20 TAB",
    "genericName": "SPIRONOLACTONE",
    "category": "Diuretics",
    "manufacturer": "KAHIRA > SEARLE-CANADA",
    "description": "Pharmaceutical product containing SPIRONOLACTONE, classified under diuretics."
  },
  {
    "name": "ALDARA 5% CREAM 12 SACHETS",
    "genericName": "IMIQUIMOD",
    "category": "Dermatological Medicines",
    "manufacturer": "MEDA AB > ONE PHARMA TECH",
    "description": "Pharmaceutical product containing IMIQUIMOD, classified under dermatological medicines."
  },
  {
    "name": "ALDOMET 250 MG 30 TAB",
    "genericName": "METHYLDOPA",
    "category": "Antihypertensives",
    "manufacturer": "KAHIRA",
    "description": "Pharmaceutical product containing METHYLDOPA, classified under antihypertensives."
  },
  {
    "name": "ALDOMET 500 MG 20 TAB",
    "genericName": "METHYLDOPA",
    "category": "Antihypertensives",
    "manufacturer": "KAHIRA",
    "description": "Pharmaceutical product containing METHYLDOPA, classified under antihypertensives."
  },
  {
    "name": "ALDOSPIRA 25 MG 20 TABS.",
    "genericName": "EPLERENONE",
    "category": "Diuretics",
    "manufacturer": "SAJA PHARMACEUTICALS",
    "description": "Pharmaceutical product containing EPLERENONE, classified under diuretics."
  },
  {
    "name": "ALDOSPIRA 50 MG 20 TABS.",
    "genericName": "EPLERENONE",
    "category": "Diuretics",
    "manufacturer": "SAJA PHARMACEUTICALS",
    "description": "Pharmaceutical product containing EPLERENONE, classified under diuretics."
  },
  {
    "name": "ALECENSA 150 MG 224 CAPS.",
    "genericName": "ALECTINIB",
    "category": "Targeted Cancer Therapies",
    "manufacturer": "F.HOFFMAN LA ROCHE > HOFFMANN LA-ROCHE",
    "description": "Pharmaceutical product containing ALECTINIB, classified under targeted cancer therapies."
  }
]
let res = []
for (let i = 0; i < categories.length; i++){
  
  for (let k = 0; k < medicine.length; k++){
    if (medicine[k].category === categories[i].name) {
      medicine[k].category = categories[i]._id
      res.push(medicine[k])
    }
  }

}

console.log(JSON.stringify(res));
console.log(res.length);
