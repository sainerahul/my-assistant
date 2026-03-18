import readline from "readline";
import { runAssistant } from "./assistant";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("🧠 AI Assistant started. Type 'exit' to quit.\n");

function ask() {
  rl.question("> ", async (input) => {
    if (input.toLowerCase() === "exit") {
      rl.close();
      return;
    }

    const reply = await runAssistant("user1", input);
    console.log(`\n🤖 ${reply}\n`);

    ask();
  });
}

ask();
