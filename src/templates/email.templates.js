export const getEmailTemplate = (data) => {
  const { nameUser, token } = data;
  
  const url = 'http://localhost:8000/#/reset';
  
  return `
    <form>
      <div>
        <label>Hola, ${nameUser}</label>
        <br>
        <a href="${url}?token=${token}&nameUser=${encodeURIComponent(nameUser)}" target="_blank">Recuperar contraseña</a>
      </div>
    </form>
  `;
}
