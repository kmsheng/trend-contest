var total = 5000;
var loadedIndex = 0;
var users = generateData(50);

var tbody = document.querySelector('#user-table > tbody');
var searchbar = document.getElementById('searchbar');

render(users);
loadedIndex += 50;

var secondTr = document.querySelector('#user-table > tbody > tr:nth-child(2)');
var secondTrTop = cumulativeOffset(secondTr);

window.addEventListener('scroll', _.throttle(handleWindowScroll, 500), false);
searchbar.addEventListener('input', handleSearchBarKeydown, false);

function cumulativeOffset(element) {

  var top = 0;
  do {
    top += element.offsetTop  || 0;
    element = element.offsetParent;
  }
  while (element);

  return top;
};

function handleSearchBarKeydown() {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=672395
  console.log('window.find(\'' + searchbar.value + '\')', window.find(searchbar.value));
}

function handleWindowScroll() {
  var body = document.body;
  var scrollTop = _.parseInt(body.scrollTop);
  var windowBottom = scrollTop + window.innerHeight;
  var bodyBottom = body.offsetHeight;

  if ((windowBottom + 500 > body.offsetHeight) && (loadedIndex < total)) {
    loadMore();
  }

  if ((scrollTop < secondTrTop) && (secondTrTop < windowBottom)) {
    body.classList.add('red');
  }
  else {
    body.classList.remove('red');
  }

}

function loadMore() {
  render(generateData(50));
  loadedIndex += 50;
}

function render(users) {
  var rowsHtml = users.map((u) => {
    var avatar = `<div class='exampleImage' style='background-image: url(${u.avatar});'></div>`;
    return `<tr>
      <td>${u.id}</td><td>${avatar}</td>
      <td>${u.firstName} ${u.lastName}</td><td>${u.companyName}</td>
      <td>${u.city}</td><td>${u.birthday}</td>
    </tr>`;
  }).join('');
  $(rowsHtml).appendTo(tbody);
}

////////////////////////////////////////////////////////////////////////
function generateData(count) {
  var trenders = [];
  var users = [];
  var trendCount = _.parseInt(count / 1000);
  for (var i = 0; i < 5; i++) {
    trenders.push(_.random(count));
  }
  for (var i = 1; i <= count; i++) {
    users.push(createFakeUser(loadedIndex + i, trenders));
  }
  return users;
};

function createFakeUser(index, trenders) {
  var isTrender = trenders.indexOf(index) > -1;
  var firstName = faker.name.firstName();
  var lastName = faker.name.lastName();
  return {
    id: index,
    avatar: faker.image.avatar(),
    city: faker.address.city(),
    email: isTrender ? `${firstName}_${lastName}@trend.com.tw` : faker.internet.email(),
    firstName: firstName,
    lastName: lastName,
    birthday: moment(faker.date.past()).add(-(_.random(30) + 20), 'years').format('YYYY/MM/DD'),
    companyName: isTrender ? 'TrendMicro' : faker.company.companyName()
  };
}
