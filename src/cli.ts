#!/usr/bin/env node

/// <reference types="node" />

import chalk from "chalk";
import boxen from "boxen";

const ascii = `
    ██████╗ ██╗   ██╗███╗   ███╗██████╗
    ██╔══██╗██║   ██║████╗ ████║██╔══██╗
    ██████╔╝██║   ██║██╔████╔██║██████╔╝
    ██╔═══╝ ██║   ██║██║╚██╔╝██║██╔═══╝
    ██║     ╚██████╔╝██║ ╚═╝ ██║██║
    ╚═╝      ╚═════╝ ╚═╝     ╚═╝╚═╝
         ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
         █  AGENT ONLINE  █
         ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
`;

const info = [
  "",
  `  ${chalk.bold("PumpAgent v1.1.0")} ${chalk.dim("—")} The PumpFun Trading API`,
  "",
  `  ${chalk.yellow("⚡")} ${chalk.bold("API")}      ${chalk.cyan("https://api.pumpapi.markets")}`,
  `  ${chalk.yellow("📦")} ${chalk.bold("npm")}      ${chalk.white("getpumpagent")}`,
  `  ${chalk.yellow("🔗")} ${chalk.bold("GitHub")}   ${chalk.cyan("github.com/getPumpAgent")}`,
  `  ${chalk.yellow("📡")} ${chalk.bold("Status")}   ${chalk.green.bold("ONLINE")}`,
  "",
  `  ${chalk.italic.dim("What took 5 days now takes 2 hours.")}`,
  "",
  `  ${chalk.greenBright("npm install getpumpagent")}`,
  "",
].join("\n");

const scanLines = [
  "> Connecting to Solana mainnet...",
  "> Loading PumpFun token stream...",
  "> Initializing Jupiter V2 routing...",
  "> MEV protection active...",
  "> Agent ready. Start trading.",
];

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  // Print ASCII art in bright green
  console.log(chalk.greenBright(ascii));

  // Print info box
  const box = boxen(info, {
    borderColor: "green",
    borderStyle: "round",
    padding: 0,
  });
  console.log(box);
  console.log();

  // Print scanning lines with delay
  for (const line of scanLines) {
    await sleep(200);
    console.log(chalk.green(line));
  }

  console.log();
  process.exit(0);
}

main();
