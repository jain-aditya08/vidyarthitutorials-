const globalExamStatus = {
    class9: {
        activeTestId: "kinematics_mock_1",
        testLive: true,
        releaseResults: true
    },
    class8: {
        activeTestId: "class8_science_mock_1",
        testLive: true,
        releaseResults: false,
    },
    class9:{
activeTestId: "english",
        testLive: true,
        releaseResults: false,
    }
};

const teacherIds = ["teacher", "a"];

// ==========================================================================
// STUDENT PROFILE DATABASE
// ==========================================================================
const studentDatabase = {
    "teacher": {
        password: "admin2026",
        name: "Teacher View",
        studentClass: 8,
        feesPaid: true,
        showResult: true,
        parentPhone: "",
        isTeacher: true,
        testHistory: []
    },
    'khanak':{
        password: 'kh',
        name:'khanak',
        studentClass: 8,
        feesPaid: false,
        showResult: false,
        parentPhone: "9599360148",
                testHistory: [],

    },
     "uiuiui": {
        password: "ui",
        name: "ui",
        studentClass: 8,
        feesPaid: false,
        showResult: false,
        parentPhone: "+919599360148",
testHistory: [
            { testId: "kinematics_archival_1", title: "Motion Basics Test Alpha", date: "Jan 15, 2026", score: 95, verified: true },
            // { testId: "kinematics_archival_1", title: "Motion Basics Test Alpha", date: "Jan 15, 2026", score: 0, verified: true },

            { testId: "kinematics_archival_2", title: "Acceleration Equations Review", date: "Feb 20, 2026", score: 87, verified: true }
        ]    }
    ,
    "rahul55": {
        password: "rahul2026",
        name: "Rahul Sharma",
        studentClass: 8,
        feesPaid: false,
        showResult: false,
        parentPhone: "+919557546332",
        testHistory: [

        ]
    },
    "suryansh": {
        password: "s",
        name: "suryansh Sharma",
        studentClass: 9,
        feesPaid: false,
        showResult: false,
        parentPhone: "+919557546332",
        testHistory: [

        ]
    },
      "p": {
        password: "p",
        name: "pp",
        studentClass: 9,
        feesPaid: false,
        showResult: false,
        parentPhone: "+919557546332",
        testHistory: [
            { testId: "english", title: "Acceleration Equations Review", date: "Feb 20, 2026", score: 30, verified: true }

        ]
    }
};


let activeSessionStudent = null;

// ==========================================================================
// WHATSAPP NOTIFICATION
// ==========================================================================
function sendWhatsAppResultNotification(student) {
    const loginUrl = encodeURIComponent(window.location.origin + window.location.pathname);
    const message = encodeURIComponent(
        `Dear Parent,\n\nYour ward *${student.name}*'s test result is now available on the Vidyarthi Portal.\n\nClick the link below to login and view the result:\n${decodeURIComponent(loginUrl)}\n\n— Vidyarthi Tutorials`
    );
    const phone = student.parentPhone.replace(/[^0-9]/g, "");
    const whatsappURL = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappURL, "_blank");
}

function notifyAllParentsSequentially() {
    const classKey = `class${activeSessionStudent.studentClass}`;
    const students = Object.values(studentDatabase).filter(s =>
        s.studentClass === activeSessionStudent.studentClass &&
        s.parentPhone &&
        s.parentPhone.trim() !== "" &&
        !s.isTeacher
    );
    let index = 0;
    function sendNext() {
        if (index >= students.length) return;
        const student = students[index];
        index++;
        sendWhatsAppResultNotification(student);
        setTimeout(sendNext, 3000);
    }
    sendNext();
}

function releaseResultsAndNotify() {
    const classKey = `class${activeSessionStudent.studentClass}`;
    globalExamStatus[classKey].releaseResults = true;
    updateExamBoxState();
    syncPerformanceDataLogs();
    notifyAllParentsSequentially();
}

// ==========================================================================
// LOGIN
// ==========================================================================
document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const userInp = document.getElementById("username").value.trim();
    const passInp = document.getElementById("password").value;
    const loginContainer = document.getElementById("login-container");
    const dashboardContainer = document.getElementById("dashboard-container");

    const TEACHER_SUFFIX = "@vidyarthi";
    const isTeacherLogin = passInp.endsWith(TEACHER_SUFFIX);
    const actualPassword = isTeacherLogin ? passInp.slice(0, -TEACHER_SUFFIX.length) : passInp;

    if (studentDatabase[userInp] && studentDatabase[userInp].password === actualPassword) {
        activeSessionStudent = { ...studentDatabase[userInp], isTeacher: isTeacherLogin };

        loginContainer.style.display = "none";
        document.getElementById("welcome-msg").innerText = `Welcome back, ${activeSessionStudent.name}!`;

        const feeDot = document.getElementById("fee-dot");
        const feeText = document.getElementById("fee-text");
        if (activeSessionStudent.feesPaid) {
            feeDot.className = "dot paid";
            feeText.innerText = "Fees Paid!";
        } else {
            feeDot.className = "dot unpaid";
            feeText.innerText = "Fees Due!";
        }

        const classKey = `class${activeSessionStudent.studentClass}`;
        const activeTestIdKey = globalExamStatus[classKey]?.activeTestId;
        const activeTestData = examConfigDatabase[activeTestIdKey];
        if (activeTestData) {
            document.getElementById("portal-test-title").innerText = `Test Name: Class ${activeSessionStudent.studentClass} - ${activeTestData.testTitle}`;
        }

        syncPerformanceDataLogs();
        updateExamBoxState();
        dashboardContainer.classList.remove("hidden");

        // const status = globalExamStatus[classKey];
        // if (status && status.releaseResults && activeSessionStudent.tempScore !== undefined) {
        //     if (!activeSessionStudent._waSent) {
        //         activeSessionStudent._waSent = true;
        //         sendWhatsAppResultNotification(activeSessionStudent);
        //     }
        // }

    } else {
        loginContainer.classList.add("error-shake");
        setTimeout(() => { loginContainer.classList.remove("error-shake"); }, 400);
    }
});

// ==========================================================================
// PERFORMANCE TABLE
// ==========================================================================
function syncPerformanceDataLogs() {
    const tableBody = document.getElementById("progress-table-body");
    const dotsLayer = document.getElementById("live-graph-dots-layer");
    const xAxisLabels = document.getElementById("dynamic-x-axis");

    tableBody.innerHTML = "";
    dotsLayer.innerHTML = "";
    xAxisLabels.innerHTML = "";

    const classKey = `class${activeSessionStudent.studentClass}`;
    const statusMeta = globalExamStatus[classKey];
    const testData = examConfigDatabase[statusMeta?.activeTestId];

    let structuralList = [...activeSessionStudent.testHistory];
    const currentActiveRecord = activeSessionStudent.testHistory.find(t => t.testId === statusMeta?.activeTestId);

    if (!currentActiveRecord && statusMeta && testData) {
        if (statusMeta.releaseResults && activeSessionStudent.tempScore !== undefined) {
            structuralList.push({
                testId: statusMeta.activeTestId,
                title: testData.testTitle,
                date: "Today",
                score: activeSessionStudent.tempScore,
                verified: true,
                resultReleased: true
            });
        } else if (activeSessionStudent.tempScore !== undefined) {
            structuralList.push({
                testId: statusMeta.activeTestId,
                title: testData.testTitle,
                date: "Today",
                score: activeSessionStudent.tempScore,
                verified: false,
                resultReleased: false
            });
        }
    }

    structuralList = structuralList.map(t => {
        if (t.testId === statusMeta?.activeTestId) {
            return { ...t, resultReleased: statusMeta.releaseResults };
        }
        return { ...t, resultReleased: true };
    });

    structuralList.forEach((test, idx) => {
        const row = document.createElement("tr");

        if (test.resultReleased && test.verified) {
            row.className = "clickable-row";
            row.style.cursor = "pointer";
            row.setAttribute("onclick", `launchResultSheet('${test.testId}', ${test.score})`);
        } else {
            row.className = "clickable-row";
            row.style.cursor = "default";
            row.style.opacity = "0.7";
        }

        const statusBadge = test.verified
            ? `<span class="badge verified">Verified</span>`
            : `<span class="badge review">Under Review</span>`;

        let percentageText;
        let colorClass;

        if (test.resultReleased && test.verified) {
            percentageText = `${test.score}% ↗`;
            colorClass = test.score >= 75 ? "text-green" : "text-amber";
        } else if (!test.resultReleased && test.verified) {
            percentageText = `Awaited`;
            colorClass = "text-amber";
        } else {
            percentageText = `Under Review`;
            colorClass = "text-amber";
        }

        row.innerHTML = `
            <td>${test.date}</td>
            <td class="text-blue">${test.title}${test.resultReleased ? ' ↗' : ''}</td>
            <td class="${colorClass}">${percentageText}</td>
            <td>${statusBadge}</td>
        `;
        tableBody.appendChild(row);

        if (test.verified && test.resultReleased) {
            const spreadIncrement = 15 + (idx * 25);
            const dot = document.createElement("span");
            dot.className = "data-dot";
            dot.style.left = `${spreadIncrement}%`;
            dot.style.bottom = `${test.score}%`;
            dot.style.backgroundColor = test.score >= 75 ? "#00FF66" : "#FFCC00";
            dot.setAttribute("title", `${test.title}: ${test.score}%`);
            dot.setAttribute("onclick", `launchResultSheet('${test.testId}', ${test.score})`);
            dotsLayer.appendChild(dot);

            const tick = document.createElement("span");
            tick.innerText = test.date.split(" ")[0];
            xAxisLabels.appendChild(tick);
        }
    });
}

// ==========================================================================
// RECEIVE EXAM SUBMISSION FROM CHILD WINDOW
// ==========================================================================
window.receiveExamSubmission = function(computedPercentage, timeTakenSeconds, answersArray) {
    activeSessionStudent.tempScore = computedPercentage;
    activeSessionStudent.tempTimeTaken = timeTakenSeconds;
    activeSessionStudent.tempAnswers = answersArray;

    const classKey = `class${activeSessionStudent.studentClass}`;
    const activeTestId = globalExamStatus[classKey]?.activeTestId;
    localStorage.setItem(`score_${activeSessionStudent.name}_${activeTestId}`, computedPercentage);
    localStorage.setItem(`time_${activeSessionStudent.name}_${activeTestId}`, timeTakenSeconds);
    localStorage.setItem(`answers_${activeSessionStudent.name}_${activeTestId}`, JSON.stringify(answersArray));

    const status = globalExamStatus[classKey];
    syncPerformanceDataLogs();
    updateExamBoxState();
    // Only restore from localStorage if the test is still the active one AND score exists
const savedScore = localStorage.getItem(`score_${activeSessionStudent.name}_${status.activeTestId}`);

    if (status && status.releaseResults && !activeSessionStudent._waSent) {
        activeSessionStudent._waSent = true;
        sendWhatsAppResultNotification(activeSessionStudent);
    }
};

// ==========================================================================
// EXAM BOX STATE
// ==========================================================================
function updateExamBoxState() {
    const classKey = `class${activeSessionStudent.studentClass}`;
    const status = globalExamStatus[classKey];
    const area = document.getElementById("test-active-area");
    const isTeacher = activeSessionStudent.isTeacher;

    const historyEntry = activeSessionStudent.testHistory.find(t => t.testId === status.activeTestId);
    const savedScore = localStorage.getItem(`score_${activeSessionStudent.name}_${status.activeTestId}`);
    const savedTime = localStorage.getItem(`time_${activeSessionStudent.name}_${status.activeTestId}`);
    const savedAnswers = localStorage.getItem(`answers_${activeSessionStudent.name}_${status.activeTestId}`);

   if (savedScore !== null && activeSessionStudent.tempScore === undefined && status.testLive) {
    activeSessionStudent.tempScore = parseInt(savedScore);
    activeSessionStudent.tempTimeTaken = parseInt(savedTime);
    activeSessionStudent.tempAnswers = savedAnswers ? JSON.parse(savedAnswers) : [];
}

    const score = activeSessionStudent.tempScore !== undefined
        ? activeSessionStudent.tempScore
        : (historyEntry ? historyEntry.score : undefined);

    // ── PHASE 0: Test not live, results not released ────────────────────────
    if (!status.testLive && !status.releaseResults) {
        area.innerHTML = `
            <div id="test-intro">
                <p id="portal-test-title" class="test-desc">Test Not Yet Live</p>
                <p class="test-rules">⏳ The examination has not been activated yet. Please check back later.</p>
                <button class="action-btn" disabled style="opacity:0.2;cursor:not-allowed;filter:grayscale(1);">🔒 Test Not Yet Live</button>
            </div>`;
        return;
    }

    // ── PHASE 3: Results released ───────────────────────────────────────────
    if (status.releaseResults) {
        if (score !== undefined) {
            area.innerHTML = `
                <div class='question-container' style='text-align:center; border-color:#00F0FF; margin-top:20px; cursor:pointer;' onclick="launchResultSheet('${status.activeTestId}', ${score})">
                    <h4 style='color:#00F0FF; margin-bottom:10px;'>📋 Result Released</h4>
                    <p style='color:#8A99AD; text-decoration:line-through; margin-bottom:8px;'>Examination Submitted</p>
                    <span style='color:#00F0FF; font-weight:600;'>Tap to view your detailed result ↗</span>
                </div>`;
        } else {
            area.innerHTML = `
                <div class='question-container' style='text-align:center; border-color:#2C3545; margin-top:20px; opacity:0.4;'>
                    <h4 style='color:#8A99AD; margin-bottom:10px;'>🔒 Examination Closed</h4>
                    <p style='color:#52667D;'>The result window is now live.<br>This test can no longer be attempted.</p>
                </div>`;
        }
        return;
    }

    // ── PHASE 2: Test is live ───────────────────────────────────────────────
    if (status.testLive) {
        if (score !== undefined) {
            // Already submitted
            if (isTeacher) {
                area.innerHTML = `
                    <div class='question-container' style='text-align:center; border-color:#FFCC00; margin-top:20px; cursor:pointer;' onclick="launchResultSheet('${status.activeTestId}', ${score})">
                        <h4 style='color:#FFCC00; margin-bottom:10px;'>👁️ Teacher View — Score: ${score}%</h4>
                        <p style='color:#fff;'>Result not yet released to students.</p>
                        <span style='color:#FFCC00;'>Click to preview full result ↗</span>
                    </div>
                    <div style='text-align:center; margin-top:16px;'>
                        <button onclick="releaseResultsAndNotify()" style='background:linear-gradient(90deg,#00FF66,#009944);color:#0D0F12;border:none;padding:14px 32px;border-radius:8px;font-size:1rem;font-weight:700;cursor:pointer;width:100%;'>
                            🚀 Release Results & Notify All Parents
                        </button>
                    </div>`;
            } else {
                area.innerHTML = `
                    <div class='question-container' style='text-align:center; border-color:#00FF66; margin-top:20px;'>
                        <h4 style='color:#00FF66; margin-bottom:10px;'>📊 Transmission Successful</h4>
                        <p style='color:#fff;'>Your responses have been securely saved.<br>Test Under Review !!</p>
                    </div>`;
            }
        } else {
            // Not submitted yet — show launch button
            const activeTestIdKey = globalExamStatus[classKey]?.activeTestId;
            const activeTestData = examConfigDatabase[activeTestIdKey];
            area.innerHTML = `
                <div id="test-intro">
                    <p id="portal-test-title" class="test-desc">Test Name: Class ${activeSessionStudent.studentClass} - ${activeTestData ? activeTestData.testTitle : ''}</p>
                    <p class="test-rules">⚠️ Note: Leaving this tab or changing windows will instantly compromise, log, and cancel your test session.</p>
                    <p class="test-rules">Make sure you are sitting in a quiet room. Your camera and background browser processes are being logged actively.</p>
                    <p class="test-rules">Ensure your network connection is stable before hitting the launch button below.</p>
                    <button id="start-test-btn-inner" class="action-btn">Launch Examination</button>
                </div>`;
            document.getElementById("start-test-btn-inner").addEventListener("click", launchExamination);
        }
    }
}

// ==========================================================================
// LAUNCH EXAMINATION
// ==========================================================================
function launchExamination() {
    const classKey = `class${activeSessionStudent.studentClass}`;
    const testIdKey = globalExamStatus[classKey]?.activeTestId;
    const testConfig = examConfigDatabase[testIdKey];

    if (!testConfig || !testConfig.questions || testConfig.questions.length === 0) {
        alert("No active examination configurations mapped for your current profile.");
        return;
    }

    const examTab = window.open("", "_blank");

    examTab.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Secure Terminal - ${testConfig.testTitle}</title>
            <style>
                body {
                    background-color: #0D0F12; color: #fff;
                    font-family: 'Segoe UI', sans-serif; padding: 40px;
                    display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0;
                    overflow-x: hidden; position: relative;
                }
                .secure-card {
                    background: #12161F; border: 1px solid #00F0FF;
                    border-radius: 14px; padding: 40px; max-width: 700px; width: 100%;
                    box-shadow: 0 0 25px rgba(0, 240, 255, 0.2);
                    position: relative; z-index: 1;
                }
                .header-flex { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #2C3545; padding-bottom: 15px; margin-bottom: 25px; }
                h2 { color: #fff; margin: 0; font-size: 1.4rem; }
                .timer { background: #FF3333; padding: 5px 12px; border-radius: 20px; font-weight: bold; font-size: 0.9rem; }
                .q-container { background: #171D2A; padding: 25px; border-radius: 8px; border: 1px solid #232D42; min-height: 120px; margin-bottom: 25px; }
                .q-text { font-size: 1.1rem; line-height: 1.6; color: #E2E8F0; }
                .options-grid { display: grid; grid-template-columns: 1fr; gap: 14px; margin-bottom: 30px; }
                .opt-btn {
                    display: block; width: 100%; background: #1A2130; border: 1px solid #2C3545;
                    color: #CDD6E0; padding: 16px 20px; text-align: left; border-radius: 8px;
                    font-size: 1rem; cursor: pointer; transition: all 0.2s; outline: none;
                }
                .opt-btn:hover { background: #242E42; border-color: #00F0FF; color: #fff; }
                .opt-btn.selected { background: #13302B; border-color: #00FF66; color: #00FF66; font-weight: 600; box-shadow: 0 0 10px rgba(0,255,102,0.1); }
                .nav-flex { display: flex; justify-content: space-between; gap: 15px; }
                .nav-btn { background: #1F2633; border: 1px solid #2C3545; color: #fff; padding: 12px 25px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .nav-btn:hover:not(:disabled) { background: #2C3545; border-color: #8A99AD; }
                .nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
                .submit-btn { background: linear-gradient(90deg, #00FF66, #009944); color: #0D0F12; border: none; }
                .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,255,102,0.3); }
                #custom-alert-overlay {
                    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                    background: rgba(255, 51, 51, 0.95); color: #fff; border: 2px solid #FF0000;
                    padding: 18px 30px; border-radius: 8px; font-weight: bold; font-size: 1.1rem;
                    box-shadow: 0 10px 30px rgba(255, 0, 0, 0.4); z-index: 9999;
                    display: none; align-items: center; gap: 15px; width: 90%; max-width: 600px;
                    animation: slideDown 0.3s ease-out;
                }
                @keyframes slideDown {
                    from { top: -100px; opacity: 0; }
                    to { top: 20px; opacity: 1; }
                }
                #submission-blur-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(13, 15, 18, 0.65); backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px); display: none;
                    justify-content: center; align-items: center; z-index: 10000;
                }
                .success-message-box {
                    background: #12161F; border: 2px solid #00FF66; padding: 35px 50px;
                    border-radius: 12px; text-align: center;
                    box-shadow: 0 0 35px rgba(0, 255, 102, 0.3);
                    animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .success-message-box h3 { color: #00FF66; margin: 0 0 12px 0; font-size: 1.6rem; font-weight: 700; }
                .success-message-box p { color: #CDD6E0; margin: 0; font-size: 1rem; }
                @keyframes scaleUp {
                    from { transform: scale(0.85); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            </style>
        </head>
        <body>
            <div id="submission-blur-overlay"></div>
            <div id="custom-alert-overlay">
                <span>🚨</span>
                <span id="alert-message-text">SECURITY ALERT: Tab switch detected outside exam space!</span>
            </div>
            <div class="secure-card">
                <div class="header-flex">
                    <h2>${testConfig.testTitle}</h2>
                    <div id="countdown" class="timer">Time Left: --:--</div>
                </div>
                <div class="q-container">
                    <div id="question-payload" class="q-text">Loading Questions...</div>
                </div>
                <div id="options-payload-grid" class="options-grid"></div>
                <div class="nav-flex">
                    <button id="prev-btn" class="nav-btn" onclick="moveTrack(-1)">Previous</button>
                    <button id="next-btn" class="nav-btn" onclick="moveTrack(1)">Next</button>
                    <button id="final-submit-btn" class="nav-btn submit-btn" onclick="finishTestMatrix(false)">Submit Examination</button>
                </div>
            </div>
            <script>
                const testQuestions = ${JSON.stringify(testConfig.questions)};
                const marksPerQuestion = ${testConfig.defaultMarksPerQuestion};
                const totalDurationSeconds = ${testConfig.durationMinutes * 60};

                let answersArray = new Array(testQuestions.length).fill(null);
                let activeIndex = 0;
                let clockRemaining = totalDurationSeconds;
                let violationCounter = 0;
                let isSubmitting = false;

                function paintQuestionInstance() {
                    const activeQ = testQuestions[activeIndex];
                    document.getElementById("question-payload").innerHTML = \`<b>Question \${activeIndex + 1} of \${testQuestions.length}:</b><br><br>\${activeQ.question}\`;
                    const grid = document.getElementById("options-payload-grid");
                    grid.innerHTML = "";
                    if (activeQ.type === "subjective") {
    grid.innerHTML = '<textarea id="subjective-ans" style="width:100%;height:120px;background:#1A2130;border:1px solid #2C3545;color:#fff;padding:14px;border-radius:8px;font-size:1rem;resize:vertical;" placeholder="Type your answer here...">' + (answersArray[activeIndex] || '') + '</textarea>';
    document.getElementById("subjective-ans").oninput = (e) => { answersArray[activeIndex] = e.target.value; };
    return;
}
                    activeQ.options.forEach((opt, idx) => {
                        const btn = document.createElement("button");
                        btn.className = "opt-btn";
                        if (answersArray[activeIndex] === idx) btn.classList.add("selected");
                        btn.innerText = opt;
                        btn.onclick = () => { answersArray[activeIndex] = idx; paintQuestionInstance(); };
                        grid.appendChild(btn);
                    });
                    document.getElementById("prev-btn").disabled = (activeIndex === 0);
                    document.getElementById("next-btn").disabled = (activeIndex === testQuestions.length - 1);
                }

                function moveTrack(direction) {
                    activeIndex += direction;
                    paintQuestionInstance();
                }

                const testTimerClock = setInterval(() => {
                    clockRemaining--;
                    let min = Math.floor(clockRemaining / 60);
                    let sec = clockRemaining % 60;
                    document.getElementById("countdown").innerText = \`Time Left: \${min}:\${sec < 10 ? '0' : ''}\${sec}\`;
                    if (clockRemaining <= 0) finishTestMatrix(true);
                }, 1000);

                window.addEventListener("blur", () => {
                    if (isSubmitting) return;
                    violationCounter++;
                    const alertBox = document.getElementById("custom-alert-overlay");
                    document.getElementById("alert-message-text").innerText = \`SECURITY ALERT: Deflection tracked! Warning \${violationCounter}/3.\`;
                    alertBox.style.display = "flex";
                    setTimeout(() => { alertBox.style.display = "none"; }, 10000);
                    if (violationCounter >= 3) finishTestMatrix(true);
                });

                function finishTestMatrix(wasAutoSubmitted) {
                    if (isSubmitting) return;
                    isSubmitting = true;
                    clearInterval(testTimerClock);

                    const timeTakenSeconds = totalDurationSeconds - clockRemaining;
                    let points = 0;
                    let maxPoints = testQuestions.length * marksPerQuestion;
                    testQuestions.forEach((q, i) => {
                        if (answersArray[i] === q.correctAnswer) points += marksPerQuestion;
                    });
                    let percent = Math.round((points / maxPoints) * 100);

                    if (window.opener && !window.opener.closed) {
                        window.opener.receiveExamSubmission(percent, timeTakenSeconds, answersArray);
                    }

                    const headingText = wasAutoSubmitted ? "⚠️ Session Locked" : "✓ Examination Submitted";
                    const bodyText = wasAutoSubmitted
                        ? "Your responses have been auto-compiled due to security flags or time expiration."
                        : "Your answers have been securely saved and transmitted.";

                    const overlay = document.getElementById("submission-blur-overlay");
                    overlay.innerHTML = \`
                        <div class="success-message-box" style="border-color: \${wasAutoSubmitted ? '#FF3333' : '#00FF66'};">
                            <h3 style="color: \${wasAutoSubmitted ? '#FF3333' : '#00FF66'};">\${headingText}</h3>
                            <p>\${bodyText}</p>
                        </div>
                    \`;
                    overlay.style.display = "flex";
                    setTimeout(() => { window.close(); }, 3000);
                }

                paintQuestionInstance();
            <\/script>
        </body>
        </html>
    `);
    examTab.document.close();
}

// Old static button — keep for safety, does nothing if area is replaced
document.getElementById("start-test-btn").addEventListener("click", launchExamination);

// ==========================================================================
// LAUNCH RESULT SHEET
// ==========================================================================
function launchResultSheet(testId, originalScore) {
    const targetConfig = examConfigDatabase[testId];
    if (!targetConfig) {
        alert("Archival data mapping requested is pending database verification clearance.");
        return;
    }

    const student = activeSessionStudent;
    const answersArray = student.tempAnswers || [];

    const totalSec = student.tempTimeTaken || 0;
    const timeMins = Math.floor(totalSec / 60);
    const timeSecs = totalSec % 60;
    const timeTakenStr = timeMins > 0 ? `${timeMins}m ${timeSecs}s` : `${timeSecs}s`;

    const totalQ = targetConfig.questions.length;
    const marksPerQ = targetConfig.defaultMarksPerQuestion;
    const maxMarks = totalQ * marksPerQ;

    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;

    targetConfig.questions.forEach((q, i) => {
        if (answersArray[i] === null || answersArray[i] === undefined) {
            skippedCount++;
        } else if (answersArray[i] === q.correctAnswer) {
            correctCount++;
        } else {
            incorrectCount++;
        }
    });

    const marksObtained = correctCount * marksPerQ;

    let incorrectHTML = "";
    targetConfig.questions.forEach((q, idx) => {
        const studentAns = answersArray[idx];
       const isSubjective = q.type === "subjective";
const isWrong = !isSubjective && (studentAns !== q.correctAnswer) && (studentAns !== null && studentAns !== undefined);
const isSkipped = (studentAns === null || studentAns === undefined || studentAns === "");
if (!isWrong && !isSkipped && !isSubjective) return;

      const studentLabel = isSkipped ? "Not Attempted" : (q.type === "subjective" ? studentAns : q.options[studentAns]);
const correctLabel = q.type === "subjective" ? "Teacher will review" : q.options[q.correctAnswer];
        const tagColor = isSkipped ? "#8A99AD" : "#FF4C4C";
const tagText = isSkipped ? "SKIPPED" : (isSubjective ? "REVIEW" : "INCORRECT");
        incorrectHTML += `
            <div class="q-card">
                <div class="q-tag" style="background:${tagColor}20; color:${tagColor}; border-color:${tagColor}40;">${tagText}</div>
                <p class="q-num">Q.${idx + 1}</p>
                <p class="q-text">${q.question}</p>
                <div class="ans-row">
                    <span class="ans-label">Your Answer:</span>
                    <span class="ans-value wrong">${studentLabel}</span>
                </div>
                <div class="ans-row">
                    <span class="ans-label">Correct Answer:</span>
                    <span class="ans-value correct">${correctLabel}</span>
                </div>
            </div>
        `;
    });

    if (!incorrectHTML) {
        incorrectHTML = `<div style="text-align:center; padding: 40px; color:#00FF66; font-size:1.2rem; font-weight:600;">🎉 Perfect Score! No incorrect answers.</div>`;
    }

    const scoreColor = originalScore >= 75 ? "#00FF66" : originalScore >= 50 ? "#FFCC00" : "#FF4C4C";
    const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

    const resultTab = window.open("", "_blank");
    resultTab.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Result — ${student.name}</title>
            <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
            <style>
                *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
                :root {
                    --bg: #060810; --surface: #0D1117; --surface2: #111827;
                    --border: #1E2A3A; --border2: #263347; --text: #E8EDF5;
                    --text-muted: #5A7090; --accent: #00D4FF;
                    --green: #00FF88; --green-glow: rgba(0,255,136,0.12);
                    --red: #FF4C4C; --red-glow: rgba(255,76,76,0.12);
                    --amber: #FFB340;
                }
                body { background: var(--bg); font-family: 'Space Grotesk', sans-serif; color: var(--text); min-height: 100vh; }
                .top-banner { background: linear-gradient(135deg, #060D1F 0%, #0A1628 50%, #060810 100%); border-bottom: 1px solid var(--border); padding: 32px 60px 28px; position: relative; overflow: hidden; }
                .top-banner::before { content: ''; position: absolute; top: -60px; right: -60px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%); pointer-events: none; }
                .banner-flex { display: flex; justify-content: space-between; align-items: flex-start; position: relative; }
                .brand-tag { color: var(--accent); font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 10px; opacity: 0.8; }
                .banner-title { font-size: 2rem; font-weight: 700; color: #fff; letter-spacing: -0.5px; }
                .banner-sub { color: var(--text-muted); font-size: 0.9rem; margin-top: 5px; }
                .score-badge-big { text-align: right; background: ${scoreColor}10; border: 1px solid ${scoreColor}30; border-radius: 16px; padding: 18px 28px; }
                .score-num { font-family: 'JetBrains Mono', monospace; font-size: 3rem; font-weight: 700; color: ${scoreColor}; line-height: 1; }
                .score-label { color: var(--text-muted); font-size: 0.8rem; margin-top: 5px; text-transform: uppercase; letter-spacing: 1px; }
                .main-wrap { max-width: 860px; margin: 0 auto; padding: 40px 30px 60px; }
                .meta-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 36px; }
                .meta-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 18px 16px; text-align: center; }
                .meta-card .m-icon { font-size: 1.4rem; margin-bottom: 8px; }
                .meta-card .m-val { font-family: 'JetBrains Mono', monospace; font-size: 1.5rem; font-weight: 700; line-height: 1; }
                .meta-card .m-lbl { color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; margin-top: 5px; }
                .meta-card.correct .m-val { color: var(--green); }
                .meta-card.incorrect .m-val { color: var(--red); }
                .meta-card.marks .m-val { color: var(--accent); }
                .meta-card.time .m-val { color: var(--amber); }
                .marks-section { margin-bottom: 36px; }
                .marks-section h3 { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; color: var(--text-muted); margin-bottom: 14px; }
                .marks-bar-bg { width: 100%; height: 10px; background: var(--surface2); border-radius: 999px; overflow: hidden; border: 1px solid var(--border); }
                .marks-bar-fill { height: 100%; width: ${originalScore}%; background: linear-gradient(90deg, ${scoreColor}99, ${scoreColor}); border-radius: 999px; box-shadow: 0 0 12px ${scoreColor}60; }
                .marks-bar-labels { display: flex; justify-content: space-between; margin-top: 8px; color: var(--text-muted); font-size: 0.8rem; font-family: 'JetBrains Mono', monospace; }
                .section-head { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid var(--border); }
                .section-head h2 { font-size: 1.1rem; font-weight: 600; }
                .section-badge { background: var(--red-glow); color: var(--red); border: 1px solid rgba(255,76,76,0.25); padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
                .q-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; margin-bottom: 16px; transition: border-color 0.2s, transform 0.2s; }
                .q-card:hover { border-color: var(--border2); transform: translateX(3px); }
                .q-tag { display: inline-block; padding: 3px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; letter-spacing: 1.5px; border: 1px solid; margin-bottom: 12px; font-family: 'JetBrains Mono', monospace; }
                .q-num { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 8px; }
                .q-text { font-size: 1rem; line-height: 1.65; margin-bottom: 18px; }
                .ans-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; }
                .ans-label { font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; min-width: 120px; padding-top: 2px; font-family: 'JetBrains Mono', monospace; }
                .ans-value { font-size: 0.95rem; font-weight: 600; padding: 6px 14px; border-radius: 6px; }
                .ans-value.wrong { color: var(--red); background: var(--red-glow); border: 1px solid rgba(255,76,76,0.2); }
                .ans-value.correct { color: var(--green); background: var(--green-glow); border: 1px solid rgba(0,255,136,0.2); }
                .result-footer { text-align: center; margin-top: 50px; padding-top: 28px; border-top: 1px solid var(--border); color: var(--text-muted); font-size: 0.82rem; }
                .close-btn { background: linear-gradient(135deg, #00D4FF20, #1b45df20); border: 1px solid #00D4FF40; color: var(--accent); padding: 12px 30px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.95rem; margin-top: 20px; transition: all 0.2s; font-family: 'Space Grotesk', sans-serif; }
                .close-btn:hover { background: linear-gradient(135deg, #00D4FF30, #1b45df30); transform: translateY(-2px); }
            </style>
        </head>
        <body>
            <div class="top-banner">
                <div class="banner-flex">
                    <div>
                        <div class="brand-tag">VIDYARTHI TUTORIALS — RESULT SHEET</div>
                        <h1 class="banner-title">${student.name}</h1>
                        <div class="banner-sub">${targetConfig.testTitle} &nbsp;·&nbsp; ${today}</div>
                    </div>
                    <div class="score-badge-big">
                        <div class="score-num">${originalScore}%</div>
                        <div class="score-label">Overall Score</div>
                    </div>
                </div>
            </div>
            <div class="main-wrap">
                <div class="meta-row">
                    <div class="meta-card correct"><div class="m-icon">✅</div><div class="m-val">${correctCount}</div><div class="m-lbl">Correct</div></div>
                    <div class="meta-card incorrect"><div class="m-icon">❌</div><div class="m-val">${incorrectCount}</div><div class="m-lbl">Incorrect</div></div>
                    <div class="meta-card marks"><div class="m-icon">🏆</div><div class="m-val">${marksObtained}/${maxMarks}</div><div class="m-lbl">Marks</div></div>
                    <div class="meta-card time"><div class="m-icon">⏱️</div><div class="m-val">${timeTakenStr}</div><div class="m-lbl">Time Taken</div></div>
                </div>
                <div class="marks-section">
                    <h3>Performance Meter</h3>
                    <div class="marks-bar-bg"><div class="marks-bar-fill"></div></div>
                    <div class="marks-bar-labels"><span>0%</span><span>${originalScore}% scored</span><span>100%</span></div>
                </div>
                <div class="section-head">
                    <h2>Incorrect &amp; Skipped Questions</h2>
                    <span class="section-badge">${incorrectCount + skippedCount} to review</span>
                </div>
                ${incorrectHTML}
                <div class="result-footer">
                    <p>Official Record — Vidyarthi Tutorials &nbsp;·&nbsp; ${today}</p>
                    <button class="close-btn" onclick="window.close()">Close Result Sheet</button>
                </div>
            </div>
        </body>
        </html>
    `);
    resultTab.document.close();
}

function launchReviewSheet(testId, originalScore) {
    launchResultSheet(testId, originalScore);
}

// document.addEventListener("DOMContentLoaded", () => {
//     setTimeout(() => {
//         document.getElementById("username").value = "a";
//         document.getElementById("password").value = "p";
//         document.getElementById("login-btn").click();
//     }, 50);
// });