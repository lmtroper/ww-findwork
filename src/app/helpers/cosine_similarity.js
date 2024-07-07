// Reference used: https://medium.com/analytics-vidhya/building-a-text-similarity-checker-using-cosine-similarity-in-javascript-and-html-75722d485703

function wordCountMap(str){
    /**
 * [function that returns a count of each distinct word in a body of text]
 * @param  {[string]} textBody
 */
    let words = str.split(' ');
    let wordCountMap = {};
    words.forEach((w)=>{
        wordCount[w] = (wordCount[w] || 0) +1;

    });
return wordCountMap;

}

function addWordsToDictionary(wordCountmap, dict){
    for(let key in wordCountmap){
        dict[key] = true;
    }
}

function wordMapToVector(map,dict){
    let wordCountVector = [];
    for (let term in dict){
        wordCountVector.push(map[term] || 0);
    }
    return wordCountVector;
}

function dotProduct(vecA, vecB){
    let product = 0;
    for(let i=0;i<vecA.length;i++){
        product += vecA[i] * vecB[i];
    }
    return product;
}

function magnitude(vec){
    let sum = 0;
    for (let i = 0;i<vec.length;i++){
        sum += vec[i] * vec[i];
    }
    return Math.sqrt(sum);
}

function cosineSimilarity(vecA,vecB){
    return dotProduct(vecA,vecB)/ (magnitude(vecA) * magnitude(vecB));
}

function textCosineSimilarity(txtA,txtB){
    // Build word counts for both texts
    const wordCountA = wordCountMap(txtA);
    const wordCountB = wordCountMap(txtB);
    let dict = {};
    // Establish a common dictionary of words to build vectors with the same dimensions
    addWordsToDictionary(wordCountA,dict);
    addWordsToDictionary(wordCountB,dict);
    
    const vectorA = wordMapToVector(wordCountA,dict);
    const vectorB = wordMapToVector(wordCountB,dict);
    return cosineSimilarity(vectorA, vectorB);
}