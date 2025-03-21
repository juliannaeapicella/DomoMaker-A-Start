let token;

const handleDomo = (e) => {
  e.preventDefault();

  $("#domoMessage").animate({width:'hide'},350);

  if($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoLevel").val() == '') {
    handleError("RAWR! All fields are required.");
    return false;
  }

  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
      loadDomosFromServer();
  });

  return false;
};

const DomoForm = (props) => {
  return (
    <form id="domoForm"
      onSubmit={handleDomo}
      name="domoForm"
      action="/maker"
      method="POST"
      className="domoForm"
    >
        <label htmlFor="name">Name: </label>
        <input id="domoName" type="text" name="name" placeholder="Domo Name" />
        <label htmlFor="age">Age: </label>
        <input id="domoAge" type="text" name="age" placeholder="Domo Age" />
        <label htmlFor="level">Level: </label>
        <input id="domoLevel" type="text" name="level" placeholder="Domo Level" />
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="makeDomoSubmit" type="submit" value="Make Domo" />
    </form>
  );
};

const DomoList = function(props) {
  if (props.domos.length === 0) {
      return (
        <div className="domoList">
            <h3 className="emptyDomo">No Domos yet!</h3>
        </div>
      );
  }

  const domoNodes = props.domos.map(function(domo) {
    return (
        <form key={domo._id} 
          id={domo._id} 
          className="domo" 
          onSubmit={deleteDomo}
          action="/deleteDomo"
          method="DELETE">
            <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
            <h3 className="domoName">Name: {domo.name} </h3>
            <h3 className="domoAge">Age: {domo.age} </h3>
            <h3 className="domoLevel">Level: {domo.level} </h3>
            <input className="deleteDomoSubmit" type="submit" value="Delete" />
        </form>
    );
  });

  return (
      <div className="domoList">
          {domoNodes}
      </div>
  );
};

const loadDomosFromServer = () => {
  sendAjax('GET', '/getDomos', null, (data) => {
    ReactDOM.render(
        <DomoList domos={data.domos}/>, document.querySelector("#domos")
    );
  });
};

const deleteDomo = (e) => {
    e.preventDefault();

    const data = `id=${e.currentTarget.id}&_csrf=${token}`

    sendAjax('DELETE', "/deleteDomo", data, () => {
        loadDomosFromServer();
    });

    return false;
};

const setup = function(csrf) {
  ReactDOM.render(
      <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
  );

  ReactDOM.render(
    <DomoForm domos={[]} />, document.querySelector("#domos")
  );

  token = csrf;

  loadDomosFromServer();
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});