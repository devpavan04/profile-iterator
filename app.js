async function getPeople() {
  const people = []
  for (let i = 0; i <= 4; i++) {
    const response = await fetch('https://randomuser.me/api/')
    const data = await response.json()
    const person = {
      name: `${data.results[0].name.first} ${data.results[0].name.last}`,
      gender: data.results[0].gender,
      phone: data.results[0].phone,
      email: data.results[0].email,
      city: data.results[0].location.city,
      country: data.results[0].location.country,
      state: data.results[0].location.state,
      image: data.results[0].picture
    }
    people.push(person)
  }
  return people
}

async function iterateProfiles() {
  const peopleArray = await getPeople()
  let nextIndex = 0
  if (nextIndex === 0) {
    document.getElementById('previous').textContent = 'load new profiles'
  }
  return {
    next: function () {
      if (nextIndex !== 0) {
        document.getElementById('previous').textContent = 'previous'
      }
      if (nextIndex === 4) {
        document.getElementById('next').textContent = 'load new profiles'
      }
      return nextIndex < peopleArray.length ? { value: peopleArray[nextIndex++], done: false } : { done: true }
    },
    previous: function () {
      nextIndex = nextIndex - 1
      if (nextIndex === 1) {
        document.getElementById('previous').textContent = 'load new profiles'
      } else if (nextIndex === 4) {
        document.getElementById('next').textContent = 'next'
      }
      return nextIndex < 0 ? { done: true } : { value: peopleArray[nextIndex - 1], done: false }
    }
  }
}

function displayProfile(currentProfile) {
  if (currentProfile !== undefined) {
    document.getElementById('display').innerHTML = `
    <img src='${currentProfile.image.large}' />
    <ul>
      <li><b>Name : </b>${currentProfile.name}</li>
      <li><b>Gender : </b>${currentProfile.gender}</li>
      <li><b>Phone : </b>${currentProfile.phone}</li>
      <li><b>Email : </b>${currentProfile.email}</li>
      <li><b>City : </b>${currentProfile.city}</li>
      <li><b>State : </b>${currentProfile.state}</li>
      <li><b>Country : </b>${currentProfile.country}</li>
    </ul>
    `
  } else {
    window.location.reload()
  }
}

function nextProfile(response) {
  const currentProfile = response.next().value
  displayProfile(currentProfile)
}

function previousProfile(response) {
  const currentProfile = response.previous().value
  displayProfile(currentProfile)
}

function showLoader() {
  const btns = Array.from(document.getElementsByTagName('button'))
  btns[0].style.display = 'none'
  btns[1].style.display = 'none'
  document.getElementById('loader').style.display = 'block'
  const msg = document.createElement('i')
  msg.textContent = 'Fetching new profiles from randomuser API'
  document.getElementById('loadingDiv').appendChild(msg)
}

function stopLoader() {
  const btns = Array.from(document.getElementsByTagName('button'))
  btns[0].style.display = 'inline-block'
  btns[1].style.display = 'inline-block'
  document.getElementById('loader').style.display = 'none'
  document.getElementById('loadingDiv').removeChild(document.getElementById('loadingDiv').children[1])
}

showLoader()

iterateProfiles()
  .then(res => {
    setTimeout(() => {
      stopLoader()
      nextProfile(res)
    }, 1000)
    document.getElementById('next').addEventListener('click', (e) => {
      nextProfile(res)
    })
    document.getElementById('previous').addEventListener('click', (e) => {
      previousProfile(res)
    })
  })