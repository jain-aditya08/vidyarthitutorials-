// // ==========================================================================
// // CENTRAL EXAM META CONFIGURATIONS & QUESTION COMPENDIUM
// // ==========================================================================
// // Add this at the absolute top of your existing questions.js
// const testConfig = {
//     showResultToStudent: true, // Change to false to instantly hide the result dashboard/breakdown
//     parentWhatsAppNumber: "91XXXXXXXXXX" // Your pre-saved WhatsApp number
// };
// const examConfigDatabase = {
//     "kinematics_mock_1": {
//         testTitle: "Kinematics Mock Test 1",
//         durationMinutes: 10, 
//         defaultMarksPerQuestion: 4,
//         questions: [
//             {
//                 question: "A high-speed metro train accelerates from rest with a uniform acceleration of 2 m/s² for 10 seconds. It then runs at a constant speed for 30 seconds, and is finally brought to rest with a uniform deceleration of 4 m/s². Calculate the total distance covered during the entire trajectory using the equations of motion.",
//                 options: ["A) 650 meters", "B) 750 meters", "C) 800 meters", "D) 900 meters"],
//                 correctAnswer: 1 // Option B
//             },
//             {
//                 question: "A stone is thrown vertically upwards with a velocity of 20 m/s from the top of a multi-storey building. The height of the point from where the stone is thrown is 25.0 m from the ground. How high will the stone rise? (Take g = 10 m/s²)",
//                 options: ["A) 20 meters", "B) 25 meters", "C) 45 meters", "D) 15 meters"],
//                 correctAnswer: 0 // Option A
//             }
//         ]
//     },
//     "hindi_grammar_1": {
//         testTitle: "Hindi Grammar Evaluation",
//         durationMinutes: 15, 
//         defaultMarksPerQuestion: 4,
//         questions: [
//             {
//                 question: "निम्न में से कौन सा शब्द संज्ञा का भेद है?",
//                 options: ["A) व्यक्तिवाचक", "B) धीरे-धीरे", "C) कल", "D) आप"],
//                 correctAnswer: 0 // Option A
//             }
//         ]
//     }
// };



// ==========================================================================
// CENTRAL EXAM META CONFIGURATIONS & QUESTION COMPENDIUM
// ==========================================================================
const examConfigDatabase = {
    "kinematics_mock_1": {
        testTitle: "Kinematics Mock Test 1",
        durationMinutes: 10,
        defaultMarksPerQuestion: 4,
        questions: [
            {
                question: "A high-speed metro train accelerates from rest with a uniform acceleration of 2 m/s² for 10 seconds. It then runs at a constant speed for 30 seconds, and is finally brought to rest with a uniform deceleration of 4 m/s². Calculate the total distance covered during the entire trajectory using the equations of motion.",
                options: ["A) 650 meters", "B) 750 meters", "C) 800 meters", "D) 900 meters"],
                correctAnswer: 1
            },
            {
                question: "A stone is thrown vertically upwards with a velocity of 20 m/s from the top of a multi-storey building. The height of the point from where the stone is thrown is 25.0 m from the ground. How high will the stone rise? (Take g = 10 m/s²)",
                options: ["A) 20 meters", "B) 25 meters", "C) 45 meters", "D) 15 meters"],
                correctAnswer: 0
            }
        ]
    },
    "hindi_grammar_1": {
        testTitle: "Hindi Grammar Evaluation",
        durationMinutes: 15,
        defaultMarksPerQuestion: 4,
        questions: [
            {
                question: "निम्न में से कौन सा शब्द संज्ञा का भेद है?",
                options: ["A) व्यक्तिवाचक", "B) धीरे-धीरे", "C) कल", "D) आप"],
                correctAnswer: 0
            }
        ]
    },

    // =====================================================================
    // CLASS 8 — SCIENCE TEST (30 Questions × 2 Marks = 60 Marks)
    // =====================================================================
    "english": {
        testTitle: "Class 8 Science — Chapter Assessment",
        durationMinutes: 40,
        defaultMarksPerQuestion: 2,
        questions: [
            {
                
    type: "subjective",
    question: "Define photosynthesis.",

            },
            {
                type: "mcq",    
                question: "The process by which plants make their own food using sunlight is called:",
                options: ["A) Respiration", "B) Photosynthesis", "C) Transpiration", "D) Digestion"],
                correctAnswer: 1
            },
            {
                question: "Which gas is released by plants during photosynthesis?",
                options: ["A) Carbon dioxide", "B) Nitrogen", "C) Oxygen", "D) Hydrogen"],
                correctAnswer: 2
            },
            {
                question: "The SI unit of force is:",
                options: ["A) Joule", "B) Pascal", "C) Newton", "D) Watt"],
                correctAnswer: 2
            },
            {
                question: "Which of the following is a non-renewable source of energy?",
                options: ["A) Solar energy", "B) Wind energy", "C) Coal", "D) Tidal energy"],
                correctAnswer: 2
            },
            {
                question: "Friction always acts in the __________ direction of motion.",
                options: ["A) Same", "B) Perpendicular", "C) Opposite", "D) Vertical"],
                correctAnswer: 2
            },
            {
                question: "The cell organelle responsible for producing energy in a cell is the:",
                options: ["A) Nucleus", "B) Ribosome", "C) Mitochondria", "D) Vacuole"],
                correctAnswer: 2
            },
            {
                question: "Sound travels fastest through:",
                options: ["A) Vacuum", "B) Air", "C) Water", "D) Steel"],
                correctAnswer: 3
            },
            {
                question: "Which of the following is a conductor of electricity?",
                options: ["A) Rubber", "B) Plastic", "C) Copper", "D) Wood"],
                correctAnswer: 2
            },
            {
                question: "The backward force experienced by a gun when a bullet is fired is called:",
                options: ["A) Friction", "B) Recoil", "C) Gravity", "D) Tension"],
                correctAnswer: 1
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["A) Jupiter", "B) Saturn", "C) Venus", "D) Mars"],
                correctAnswer: 3
            },
            {
                question: "The process of converting water vapour into liquid water is called:",
                options: ["A) Evaporation", "B) Condensation", "C) Sublimation", "D) Transpiration"],
                correctAnswer: 1
            },
            {
                question: "The chemical formula of common salt is:",
                options: ["A) KCl", "B) CaCO₃", "C) NaCl", "D) MgSO₄"],
                correctAnswer: 2
            },
            {
                question: "Which of the following is an example of a chemical change?",
                options: ["A) Dissolving sugar in water", "B) Cutting a paper", "C) Burning of candle", "D) Melting of wax"],
                correctAnswer: 2
            },
            {
                question: "The lens used to correct short-sightedness (myopia) is:",
                options: ["A) Convex lens", "B) Concave lens", "C) Bifocal lens", "D) Plane lens"],
                correctAnswer: 1
            },
            {
                question: "Which organ in the human body filters blood?",
                options: ["A) Liver", "B) Lungs", "C) Heart", "D) Kidneys"],
                correctAnswer: 3
            },
            {
                question: "The speed of light in vacuum is approximately:",
                options: ["A) 3 × 10⁶ m/s", "B) 3 × 10⁸ m/s", "C) 3 × 10¹⁰ m/s", "D) 3 × 10⁴ m/s"],
                correctAnswer: 1
            },
            {
                question: "An object is said to be in uniform motion when it covers:",
                options: ["A) Unequal distances in equal time intervals", "B) Equal distances in unequal time intervals", "C) Equal distances in equal time intervals", "D) None of the above"],
                correctAnswer: 2
            },
            {
                question: "Which of the following vitamins is synthesized by the human skin in the presence of sunlight?",
                options: ["A) Vitamin A", "B) Vitamin B12", "C) Vitamin C", "D) Vitamin D"],
                correctAnswer: 3
            },
            {
                question: "The hardest natural substance known is:",
                options: ["A) Gold", "B) Iron", "C) Diamond", "D) Quartz"],
                correctAnswer: 2
            },
            {
                question: "Which type of mirror is used as a rear-view mirror in vehicles?",
                options: ["A) Plane mirror", "B) Concave mirror", "C) Convex mirror", "D) Parabolic mirror"],
                correctAnswer: 2
            },
            {
                question: "Ozone layer is present in which layer of the atmosphere?",
                options: ["A) Troposphere", "B) Stratosphere", "C) Mesosphere", "D) Thermosphere"],
                correctAnswer: 1
            },
            {
                question: "The unit of electric current is:",
                options: ["A) Volt", "B) Ohm", "C) Watt", "D) Ampere"],
                correctAnswer: 3
            },
            {
                question: "Which of the following is NOT a greenhouse gas?",
                options: ["A) Carbon dioxide", "B) Methane", "C) Oxygen", "D) Water vapour"],
                correctAnswer: 2
            },
            {
                question: "Newton's first law of motion is also known as the Law of:",
                options: ["A) Acceleration", "B) Inertia", "C) Action and Reaction", "D) Gravitation"],
                correctAnswer: 1
            },
            {
                question: "Which part of the plant absorbs water and minerals from the soil?",
                options: ["A) Leaves", "B) Stem", "C) Roots", "D) Flowers"],
                correctAnswer: 2
            },
            {
                question: "The phenomenon of splitting of white light into its constituent colours is called:",
                options: ["A) Reflection", "B) Refraction", "C) Dispersion", "D) Diffraction"],
                correctAnswer: 2
            },
            {
                question: "Which blood cells are responsible for fighting infections?",
                options: ["A) Red blood cells", "B) Platelets", "C) White blood cells", "D) Plasma cells"],
                correctAnswer: 2
            },
            {
                question: "The force of gravity on the Moon is approximately __________ that on Earth.",
                options: ["A) Equal to", "B) Twice", "C) One-sixth", "D) One-half"],
                correctAnswer: 2
            },
            {
                question: "Which of the following is used as a fuel in nuclear power plants?",
                options: ["A) Uranium", "B) Carbon", "C) Hydrogen", "D) Nitrogen"],
                correctAnswer: 0
            }
        ]
    }
};