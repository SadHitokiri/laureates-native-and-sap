const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const exists = util.promisify(fs.exists);

const GIT_HEAD_PATTERN = /ref: refs\/heads\/([^\n]+)/;
const BRANCH_NAME_PATTERN = /^(fix|feature)\/(TRAINING|TASK1)-[0-9]+\/main(\/[0-9A-Za-z\-]*)+$/;

const branchName = (data) => {
	const match = GIT_HEAD_PATTERN.exec(data);
	return match ? match[1] : undefined;
};

const gitHeadPath = async () => {
	const headPath = '.git/HEAD';
	const headPathExists = await exists(headPath);
	if (!headPathExists) {
		throw new Error('.git/HEAD does not exist');
	}
	return headPath;
};

const run = async () => {
	const headPath = await gitHeadPath();
	const data = await readFile(headPath);
	const name = branchName(data.toString());
	const match = BRANCH_NAME_PATTERN.exec(name);
	if (match) {
		process.exit(0);
	}
	console.log(`Branch name '${name}' does not match pattern ${BRANCH_NAME_PATTERN.toString()}`);
	process.exit(1);
};

run()
	.then()
	.catch((error) => {
		console.log(error);
		process.exit(1);
	});
