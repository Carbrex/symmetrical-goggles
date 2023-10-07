const translatte = require('translatte');

translatte(
	'Despite the relentless downpour that had persisted for days, the intrepid group of hikers embarked on their arduous journey through the treacherous terrain, armed with nothing but their unwavering determination and a tattered map that had seen better days.',
	{ to: 'hi' }
)
	.then((res) => {
		console.log(res.text);
	})
	.catch((err) => {
		console.error(err);
	});
// Ihr sprecht auf Russisch?
