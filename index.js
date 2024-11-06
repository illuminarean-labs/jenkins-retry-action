const core = require('@actions/core');
const axios = require('axios');

async function run() {
    const jenkinsUrl = core.getInput('jenkins-url', {required: true});
    const jenkinsUser = core.getInput('jenkins-user', {required: true});
    const jenkinsToken = core.getInput('jenkins-token', {required: true});
    const jenkinsJob = core.getInput('jenkins-job', {required: true});
    const jenkinsParameters = core.getInput('jenkins-parameters').replaceAll(
        ",", "&");
    const maxRetries = parseInt(core.getInput('max-retries'));
    const retryIntervalSeconds = parseInt(core.getInput('retry-interval-secs'));

    let exit = false;

    for (let retries = 0; retries < maxRetries + 1; retries++) {
        if (retries === maxRetries) {
            core.setFailed(`Max retries reached: ${retries}`);
            return;
        }

        try {
            const response = await axios.post(
                `${jenkinsUrl}/job/${jenkinsJob}/buildWithParameters?${jenkinsParameters}`,
                {}, {
                    auth: {username: jenkinsUser, password: jenkinsToken}
                }
            )

            if (response.status === 201) {
                exit = true;
                core.info(`Success Jenkins Job: ${jenkinsJob} - Build Queued`);
            }
        } catch (error) {
            if (error.response.status === 404 || error.response.status === 403) {
                if (retries < maxRetries) {
                    core.info(`${error.response.status} Occured Retrying... ${retries + 1}`)

                    await new Promise(resolve => setTimeout(resolve, retryIntervalSeconds * 1000));
                }
            } else {
                exit = true;
                core.setFailed(
                    `Status: ${error.response.status} - ${error.response.statusText}`);
            }
        }

        if (exit) {
            return;
        }
    }
}

run().then()