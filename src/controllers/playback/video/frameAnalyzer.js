import { createWorker } from 'tesseract.js';

export class FrameAnalyzer {
    #worker;

    constructor() {
        this.#worker = createWorker('eng');
    }

    async analyzeFrameText(frameImage) {
        if (!frameImage) {
            console.error('No image data provided');
            return;
        }

        const worker = await this.#worker;
        const { data } = await worker.recognize(frameImage);
        console.log('Detected text:', data.text);
        return data.text;
    }

    analyze = function(frameImage) {
        // Optionally, call analyzeFrameText after setting img.src
        setTimeout(() => {
            this.analyzeFrameText(frameImage);
        }, 500); // Wait for image to load
    };
}
