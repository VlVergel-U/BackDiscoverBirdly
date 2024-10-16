export const getEmailTemplate = (token, nameUser) => {

    const url = 'http://localhost:8000/#/reset';
    
    return `
    <form>
      <div>
        <label>Hola, ${ nameUser }</label>
        <br>
        <a href="${ url }?token=${ token }" target="_blank">Recuperar contraseña</a>
      </div>
    </form>
    `;
  }
  