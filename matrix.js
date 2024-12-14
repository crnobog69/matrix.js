const readline = require("readline");
const process = require("process");

class MatrixRain {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.columns = new Array(width).fill(0);
    this.characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZαβγδεζηθικλμνξοπρστυφχψω0123456789";

    // ANSI color codes
    this.colors = {
      green: "\x1b[32m",
      brightGreen: "\x1b[92m",
      darkGreen: "\x1b[2;32m",
      reset: "\x1b[0m",
    };
  }

  generateRandomChar() {
    return this.characters[Math.floor(Math.random() * this.characters.length)];
  }

  drawFrame() {
    // Clear previous frame
    console.clear();

    // Create a 2D grid to render
    const grid = Array.from({ length: this.height }, () =>
      Array(this.width).fill(" ")
    );

    // Create a corresponding color grid
    const colorGrid = Array.from({ length: this.height }, () =>
      Array(this.width).fill(this.colors.reset)
    );

    // Update and draw each column
    for (let x = 0; x < this.width; x++) {
      // Randomize drop speed and length
      if (Math.random() > 0.9) {
        this.columns[x] = 0;
      }

      // Draw the current column's trail
      for (let y = 0; y < this.height; y++) {
        if (y < this.columns[x]) {
          // Vary color intensity along the trail
          if (y === this.columns[x] - 1) {
            // Brightest character at the end of the trail
            colorGrid[y][x] = this.colors.brightGreen;
          } else if (y > this.columns[x] - 5) {
            // Middle of the trail
            colorGrid[y][x] = this.colors.green;
          } else {
            // Tail of the trail
            colorGrid[y][x] = this.colors.darkGreen;
          }

          grid[y][x] = this.generateRandomChar();
        }
      }

      // Increment column
      this.columns[x]++;
      if (this.columns[x] > this.height) {
        this.columns[x] = 0;
      }
    }

    // Render the grid with colors
    const frame = grid
      .map(
        (row, y) =>
          row.map((char, x) => `${colorGrid[y][x]}${char}`).join("") +
          this.colors.reset
      )
      .join("\n");

    process.stdout.write(frame);
  }

  start() {
    // Hide cursor
    process.stdout.write("\x1B[?25l");

    // Run animation
    const intervalId = setInterval(() => {
      this.drawFrame();
    }, 100);

    // Handle exit
    process.on("SIGINT", () => {
      clearInterval(intervalId);
      // Show cursor again
      process.stdout.write("\x1B[?25h");
      console.log("\nMatrix rain stopped.");
      process.exit();
    });
  }
}

// Get terminal size
const width = process.stdout.columns;
const height = process.stdout.rows;

// Create and start matrix rain
const matrixRain = new MatrixRain(width, height);
matrixRain.start();
