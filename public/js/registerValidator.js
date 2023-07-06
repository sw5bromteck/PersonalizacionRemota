window.addEventListener("load", function () {
  const form = document.querySelector("form");
  const inputs = document.querySelectorAll("input");

  const expresiones = {
    firstname: /^[a-zA-ZÀ-ÿ\s]{2,40}$/,
    lastname: /^[a-zA-ZÀ-ÿ\s]{2,40}$/,
    company: /^[a-zA-ZÀ-ÿ\s]{2,40}$/,
    phone: /^\d{10}$/,
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  };

  const campos = {
    firstname: false,
    lastname: false,
    company: false,
    phone: false,
    email: false,
  };

  function validarFormulario(e) {
    switch (e.target.name) {
      case "firstname":
        validarCampo(expresiones.firstname, e.target, e.target.name);
        break;
      case "lastname":
        validarCampo(expresiones.lastname, e.target, e.target.name);
        break;
      case "company":
        validarCampo(expresiones.company, e.target, e.target.name);
        break;
        case "phone":
          validarCampo(expresiones.phone, e.target, e.target.name);
          break;
      case "email":
        validarCampo(expresiones.email, e.target, e.target.name);
        break;
    }
  }

  function validarCampo(expresion, input, campo) {
    if (expresion.test(input.value)) {
      document.querySelector(`#container-${campo} .none`).classList.remove("block");
      campos[campo] = true;
    } else {
      document.querySelector(`#container-${campo} .none`).classList.add("block");
      campos[campo] = false;
    }
  }

  inputs.forEach((input) => {
    input.addEventListener("keyup", validarFormulario);
    input.addEventListener("blur", validarFormulario);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if ( campos.firstname && campos.lastname && campos.company && campos.phone && campos.email ) {
      form.submit();
    }
  });
});
