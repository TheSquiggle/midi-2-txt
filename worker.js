// Function to process MIDI file in chunks
function processMidiFile(file) {
    const chunkSize = 100000; // Size of chunks to send to workers
    const fileReader = new FileReader();
    let chunkId = 0;

    // Calculate total chunks
    totalChunks = Math.ceil(file.size / chunkSize);

    // Recursive function to read and process the file in chunks
    function readNextChunk(start) {
        if (start >= file.size) return; // Stop if all chunks have been processed

        // Read the next chunk from the file
        fileReader.onload = function(event) {
            const chunkData = event.target.result;
            workers[chunkId % workerCount].postMessage({ chunkId, chunkData });
            chunkId++;

            // Call the function again for the next chunk
            readNextChunk(start + chunkSize);
        };

        // Slice the file to read the next chunk
        fileReader.readAsArrayBuffer(file.slice(start, start + chunkSize));
    }

    // Start the reading process from the first chunk
    readNextChunk(0);
}
