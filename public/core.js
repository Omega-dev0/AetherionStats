function getRBLXIDFromUsername(username) {
    return new Promise((resolve, reject) => {
            fetch('https://users.roblox.com/v1/usernames/users', {
                method: 'POST',
                headers: {'Content-Type': 'application/json','Accept': 'application/json'},
                body: JSON.stringify({
                   usernames: [ username ],
                   excludeBannedUsers: false
                })
            })
            .then(response => response.json())
                .then(data => {
                    resolve(data.data[0].id)
                })
                .catch(error => {
                    console.error(error)
                    reject(error)
                })
            .catch(error => {
                console.error(error)
                reject(error)
            });

    });

}