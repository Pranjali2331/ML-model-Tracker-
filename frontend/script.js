// filepath: frontend/script.js
const apiUrl = "http://127.0.0.1:5000/predict";

function getVal(id) {
  return document.getElementById(id).value;
}

function showResult(text) {
  document.getElementById("result").innerText = text;
}

async function predict() {
  const payload = {
    age: parseInt(getVal("age")),
    last_period: getVal("last_period"),
    avg_cycle: parseInt(getVal("avg_cycle")),
    period_duration: parseInt(getVal("period_duration")),
    sleep: parseFloat(getVal("sleep")),
    exercise: parseInt(getVal("exercise")),
    flow: getVal("flow") === "" ? null : parseInt(getVal("flow")),
    regularity: getVal("regularity") === "" ? null : parseInt(getVal("regularity"))
  };

  // basic client-side validation
  if (!payload.age || !payload.last_period || !payload.avg_cycle) {
    showResult("⚠️ Please fill required fields: Age, Last Period, Avg Cycle.");
    return;
  }

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    showResult("🌼 Your next period is likely around: " + data.next_period_date);
  } catch (err) {
    showResult("⚠️ Could not get prediction. Is the backend running?");
    console.error(err);
  }
}

document.getElementById("predictBtn").addEventListener("click", predict);