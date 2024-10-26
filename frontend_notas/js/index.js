const contenedorNotas = document.getElementById("contenedorNotas")
const modalNotas = document.getElementById("modal")
const instanceModalNotas = new bootstrap.Modal(modalNotas)
const contenedorAnuncios = document.getElementById('contenedorAnuncios')

class Notas {
    constructor() {
        this.notas = this.obtenerNotas();
    }

    /* async obtenerNotas()  {
        try {
            const response = await fetch('http://localhost:4000/api/notas', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            this.notas = await response.json()
            this.mostrarNotas(this.notas)
        } catch(err) {
            console.error('Error al obtener notas:', err)
        }
    } */
    async obtenerNotas() {
        try {
            const response = await fetch('http://localhost:4000/api/notas', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            this.notas = await response.json();
            this.mostrarNotas(this.notas);
        } catch(err) {
            console.error('Error al obtener notas:', err);
        }
    }

    mostrarNotas(notasFiltradas) {
        contenedorNotas.innerHTML = ''
        console.log(this.notas)

        if(Array.isArray(notasFiltradas)){
            notasFiltradas.forEach((nota,index) => {
                contenedorNotas.innerHTML+=`
                <div class="col">
                    <div class="card" id="${index}" onclick="notas.seleccionarNota(${index})">
                        <div class="card-body">
                            <h5 class="card-title">${nota.tit_not}</h5>
                            <p class="card-text">${nota.des_not}</p>
                        </div>
                    </div>
                </div>`
            })
        } else {
            console.error('notasFiltradas no es un arreglo')
        }
    }
    async agregarNota() {
        const tit_not = document.getElementById("tit_not").value
        const des_not = document.getElementById("des_not").value
        
        try {
            const response = await fetch('http://localhost:4000/api/notas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ tit_not: tit_not, des_not: des_not})
            })

            const nuevaNota = await response.json()
            this.notas.push(nuevaNota)
            this.mostrarNotas(this.notas)
            instanceModalNotas.hide()
            
            /* modalNotas.addEventListener('hidden.bs.modal', ()=> {
                document.getElementById('tit_not').value = ""
                document.getElementById('des_not').value = ""
            }) */
        } catch (err) {
            console.error('Error al agregar la nota:', err)
        }

    }
    guardarNota() {
        let notasString = JSON.stringify(this.notas)
        localStorage.setItem('notas', notasString)
        this.mostrarNotas(this.notas)
        instanceModalNotas.hide()
    }
    seleccionarNota(index) {
        const btnEditar = document.getElementById("btnEditar")
        const btnAgregar = document.getElementById("btnAgregar")
        const btnEliminar = document.getElementById("btnEliminar")
        btnAgregar.hidden=true;
        btnEditar.hidden=false;
        btnEliminar.hidden= false;
        const nota = this.notas[index]
        const tit_not =  document.getElementById("tit_not")
        const des_not = document.getElementById("des_not")
        tit_not.value = nota.tit_not
        des_not.value = nota.des_not
        instanceModalNotas.show();
        btnEditar.onclick = () => {
            this.editarNota(index)
        }
        btnEliminar.onclick =()=> {
            this.eliminarNota(index)
        }
    }
    async editarNota(index) {
        const tit_not = document.getElementById('tit_not').value;
        const  des_not = document.getElementById('des_not').value;
        const notaId = this.notas[index]._id
        /* this.notas[index] = ({tit_not, des_not});
        this.guardarNota(); */

        try {
            const response = await fetch(`http://localhost:4000/api/notas/${notaId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ tit_not, des_not })
            })

            const notaActualizada = await response.json()
            this.notas[index] = notaActualizada
            this.mostrarNotas(this.notas)
            instanceModalNotas.hide()
        } catch (err) {
            console.error('Error al editar la nota:', err)
        }
    }
    async eliminarNota(index) {
        /* this.notas.splice(index, 1);
        this.guardarNota(); */

        const notaId = this.notas[index]._id

        try {
            await fetch(`http://localhost:4000/api/notas/${notaId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            this.notas.splice(index, 1)
            this.mostrarNotas(this.notas)
            instanceModalNotas.hide()
        } catch(err) {
            console.error('Error al eliminar la nota', err)
        }
    }
    buscarNotas () {
        const des_notBuscar = document.getElementById('buscar').value.trim();
        const notasFiltradas = this.notas.filter(nota => {
            return nota.tit_not.toLowerCase().includes(des_notBuscar.toLowerCase()) || nota.des_not.toLowerCase().includes(des_notBuscar.toLowerCase());
        });
        if(notasFiltradas.length >= 1) {
            contenedorAnuncios.innerHTML = `
            <div class="col-12 d-flex justify-content-center mt-3 mb-4" data-bs-theme="dark">
                <button type="button" class="me-1 rounder-circle border p-2 btn-close" id="cancelarBusqueda" onclick="notas.cancelarBusqueda()"></button>
            </div>
        `
        } else {
            contenedorAnuncios.innerHTML = `
            <div class="col-12 d-flex justify-content-center">
                <h3 class="text-center opacity-50 text-light">
                    No hay resultados de búsqueda
                </h3>
            </div>
            
            <div class="col-12 d-flex justify-content-center mt-3 mb-4" data-bs-theme="dark">
                <button type="button" class="me-1 rounder-circle border p-2 btn-close" id="cancelarBusqueda" onclick="notas.cancelarBusqueda()"></button>
            </div>
        `
        }
        this.mostrarNotas(notasFiltradas);
    }
    cancelarBusqueda () {
        document.getElementById('buscar').value = '';
        contenedorAnuncios.innerHTML = '';
        this.mostrarNotas(this.notas);
    }
}

const notas = new Notas()
/* notas.mostrarNotas(notas.notas) */

modalNotas.addEventListener('hidden.bs.modal', ()=> {
    document.getElementById('tit_not').value = ""
    document.getElementById('des_not').value = ""
    document.getElementById('btnAgregar').hidden = false
    document.getElementById('btnEditar').hidden = true
    document.getElementById('btnEliminar').hidden = true
})

function focusTitulo() {
    setTimeout(() => {
        document.getElementById('tit_not').focus()
    }, 500);
}

// Autenticación

class Auth {
    async register() {
        const ali_usu = document.getElementById('registerUsername').value;
        const ema_usu = document.getElementById('registerEmail').value;
        const cla_usu = document.getElementById('registerPassword').value;


        try {
            const response = await fetch('http://localhost:4000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ali_usu, ema_usu, cla_usu })
            })
            const data = await response.json()

            if (response.ok) {
                alert("Registro exitoso, por favor inicia sesión")
                bootstrap.Modal.getInstance(document.getElementById("registerModal")).hide()
            } else {
                alert(data.message || "Error en el registro")
            }
        } catch (err) {
            console.error('Error en el registro:', err)
        }
    }

    async login() {
        const loginInput = document.getElementById("loginUsername").value
        const cla_usu = document.getElementById("loginPassword")

        const bodyData = loginInput.includes('@')
            ? { ema_usu: loginInput, cla_usu }
            : { ali_usu: loginInput, cla_usu }

        try {
            const response = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            })
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token)
                bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide()
                notas.obtenerNotas()
            } else {
                alert(data.message || "Error en el inicio de sesión")
            }
        } catch (err) {
            console.error('Error en el inicio de sesión:', err)
        }
    }

    logout() {
        localStorage.removeItem('token')
        location.reload()
    }

    isLoggedIn() {
        return !!localStorage.getItem('token')
    }

    showRegisterModal() {
        const loginModal = bootstrap.Modal.getInstance(document.getElementById("loginModal"))
        loginModal.hide()
        const registerModal = new bootstrap.Modal(document.getElementById("registerModal"))
        registerModal.show()
    }

    showLoginModal() {
        const registerModal = bootstrap.Modal.getInstance(document.getElementById("registerModal"))
        registerModal.hide()
        const loginModal = new bootstrap.Modal(document.getElementById("loginModal"))
        loginModal.show()
    }

    showSuccessMessage() {
        const successMessage = document.getElementById("registerSuccess")
        successMessage.classList.remove('d-none')
        setTimeout(() => {
            successMessage.classList.add('d-none')
        }, 3000) // Ocultamos el mensaje después de 3 segundos
    }

    clearRegisterInputs() {
        document.getElementById("registerUsername").value = ""
        document.getElementById("registerEmail").value = ""
        document.getElementById("registerPassword").value = ""
    }
}

const auth = new Auth()

// Verificar el estado de la sesión al cargar la página
window.addEventListener("load", () => {
    if (!auth.isLoggedIn()) {
        new bootstrap.Modal(document.getElementById("loginModal")).show();
    } else {
        notas.obtenerNotas();
    }
})