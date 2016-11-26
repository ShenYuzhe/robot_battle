queue = require('queue');

q = queue();

for (var i = 0; i < 10; i++)
    q.push(i);


while (q.length > 0)
    console.log(q.shift());
