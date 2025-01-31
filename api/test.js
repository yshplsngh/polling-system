const allClients = new Map();

allClients.set(1,new Set());
allClients.set(2,new Set());
allClients.set('leaderboard',new Set());

allClients.get(1).add(1);
allClients.get(1).add(9);
allClients.get(1).add(3);

allClients.get(2).add(4);
allClients.get(2).add(2);
allClients.get(2).add(6);

allClients.get('leaderboard').add(7);
allClients.get('leaderboard').add(8);
allClients.get('leaderboard').add(2);


// const ans = (0/0)*100 ?? 0
// console.log(ans)
// console.log(allClients);

// allClients.forEach((singleMap) => {
//     singleMap.delete(2);
// })
// console.log(allClients);

// allClients.get(1).delete(1);


// console.log(allClients.has(1));

// allClients.forEach((singleMap)=>{
//     singleMap.delete(1);
// })

// console.log(allClients);
// console.log(allClients.get(1));
// allClients.get(1).delete(1)

// console.log(allClients.get(1));

// console.log(allClients.get(2));
