import tf from '@tensorflow/tfjs-node';

export async function predict(buffer) {
    const model = await tf.loadGraphModel('file://src/config/tfjs_files/model.json');
    //console.log("hello");
    const tensor = tf.node
        .decodeImage(buffer, 3)
        .resizeNearestNeighbor([150, 150])
        .toFloat()
        .expandDims();

    const prediction = model.predict(tensor)
    const result = prediction.as1D().argMax().dataSync()[0];
    return result + 1;
}