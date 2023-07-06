function messageRes ({ firstname, lastname }) {
    let res =   `
                <p>Estimado/a ${firstname} ${lastname},</p>
                <p>Queremos informarte que hemos recibido tu consulta y estamos encantados de brindarte más información sobre nuestro producto. Nuestro equipo está revisando tu solicitud en este momento y se comunicará contigo a la brevedad.</p>
                <p>Si tienes alguna pregunta adicional o necesitas más detalles sobre nuestro producto, no dudes en comunicarte con nosotros a través de este correo electrónico o a través de los medios de contacto proporcionados en nuestra página web.</p>
                <p>¡Te mantendremos informado/a sobre los avances de tu solicitud y estaremos en contacto pronto!</p>
                <p>Saludos cordiales, Bromteck.</p>
                `;

    return res;
};

module.exports = messageRes;