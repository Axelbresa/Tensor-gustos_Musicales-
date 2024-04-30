 // Bands and features data
 const bands = ['Nirvana', 'Nine Inch Nails', 'Backstreet Boys', 'N Sync', 'Night Club', 'Apashe', 'STP'];
 const features = ['Grunge', 'Rock', 'Industrial', 'Boy Band', 'Dance', 'Techno'];

 // Create HTML elements for each band
 const groupsContainer = document.getElementById('groups-container');
 bands.forEach((band, index) => {
   const groupDiv = document.createElement('div');
   groupDiv.innerHTML = `
     <p>${band}</p>
     <input type="number" min="1" max="10" id="group${index}" />
   `;
   groupsContainer.appendChild(groupDiv);
 });

 // Process user votes
 function processVotes() {
   const userVotes = [];
   let invalidInput = false;

   bands.forEach((band, index) => {
     const voteInput = document.getElementById(`group${index}`);
     const vote = parseInt(voteInput.value);

     if (vote < 1 || vote > 10 || isNaN(vote)) {
       invalidInput = true;
       return;
     }

     userVotes.push(vote);
   });

   if (invalidInput) return;

   // Calculate user's favorite styles
   const userVotesTensor = tf.tensor([userVotes]);
   const bandFeatsTensor = tf.tensor([
   [1, 1, 0, 0, 0, 0], // Nirvana: Grunge, Rock
   [1, 0, 1, 0, 0, 0], // Nine Inch Nails: Grunge, Industrial
   [0, 0, 0, 1, 1, 0], // Backstreet Boys: Boy Band, Dance
   [0, 0, 0, 1, 0, 0], // N Sync: Boy Band
   [0, 0, 1, 0, 0, 1], // Night Club: Industrial, Techno
   [0, 0, 1, 0, 0, 1], // Apashe: Industrial, Techno
   [1, 1, 0, 0, 0, 0], // STP: Grunge, Rock

   ]);

   const userFeatsTensor = tf.matMul(userVotesTensor, bandFeatsTensor);
   const topUserFeatures = tf.topk(userFeatsTensor, features.length);
   const topGenresIndices = topUserFeatures.indices.arraySync()[0];

   // Display the ranking
   const resultContainer = document.getElementById('result-container');
   const rankingList = document.getElementById('ranking-list');
   rankingList.innerHTML = '';

   // Sort indices based on user's preference
   const sortedIndices = topGenresIndices.slice().sort((a, b) => userVotes[b] - userVotes[a]);

   sortedIndices.forEach((index) => {
     const genre = features[index];
     const li = document.createElement('li');
     li.textContent = genre;
     rankingList.appendChild(li);
   });

   resultContainer.style.display = 'block';
 }