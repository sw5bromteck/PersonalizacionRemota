function messageReq ({ firstname, lastname, company, phone, email }) {
    let req =   `
                <p>El siguiente usuario desea saber más información acerca del producto:</p>
                <p><b>Nombre: </b>${firstname}</p>
                <p><b>Apellido: </b>${lastname}</p>
                <p><b>Telefono: </b>${phone}</p>
                <p><b>Empresa: </b>${company}</p>
                <p><b>Email: </b>${email}</p>
                `;

    return req;
};

module.exports = messageReq;