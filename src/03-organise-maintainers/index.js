/**
 * Make the following POST request with either axios or node-fetch:

POST url: http://ambush-api.inyourarea.co.uk/ambush/intercept
BODY: {
    "url": "https://api.npms.io/v2/search/suggestions?q=react",
    "method": "GET",
    "return_payload": true
}

 *******

The results should have this structure:
{
    "status": 200.0,
    "location": [
      ...
    ],
    "from": "CACHE",
    "content": [
      ...
    ]
}

 ******

 * With the results from this request, inside "content", 
 * list every maintainer and each package name that they maintain,
 * return an array with the following shape:
[
    ...
    {
        username: "a-username",
        packageNames: ["a-package-name", "another-package"]
    }
    ...
]
 * NOTE: the parent array and each "packageNames" array should 
 * be in alphabetical order.
 */

const { default: axios } = require("axios");

module.exports = async function organiseMaintainers() {
  // TODO
  var names = []
  var maintainers = []

  const setOrder = (array) => {
    var response = []

    const namesOrdened = names.sort()

    array.forEach( item => {

      response[namesOrdened.indexOf(item.username)] = {
                          username: item.username,
                          packageNames: item.packageNames.sort()
                        }
    })

    return response
  }

  const setData = (data) => {

    const packageName = data.name

    data.maintainers.forEach(usernameData => {

      let username = usernameData.username
      let userIndex = names.indexOf(username)

      if(userIndex === -1){
        
        names.push(username)

        maintainers.push({
          username: username,
          packageNames: [packageName]
        })
      }else{

        maintainers[userIndex].packageNames.push(packageName)
      }
    });
  }

  await axios.post('http://ambush-api.inyourarea.co.uk/ambush/intercept',{
    "url": "https://api.npms.io/v2/search/suggestions?q=react",
    "method": "GET",
    "return_payload": true
  }).then( res => {

    if(res && res.data && res.data.content){
      res.data.content.map( item => {

        setData(item.package)
      })
    }    
  })

  maintainers = setOrder(maintainers)

  return maintainers
};
