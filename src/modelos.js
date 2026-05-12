import './style.css'
import { supabase } from './supabase.js'

const tabela = document.getElementById('tabela-modelos')
const formModelo = document.getElementById('form-modelo')
const campoId = document.getElementById('modelo-id')
const campoMarca = document.getElementById('marca')
const campoDescricao = document.getElementById('descricao')
const tituloFormulario = document.getElementById('titulo-formulario')
const btnSalvar = document.getElementById('btn-salvar')
const btnCancelar = document.getElementById('btn-cancelar')
const btnLogout = document.getElementById('btn-logout')
const messageDiv = document.getElementById('message')

const showMessage = (text, type = 'error') => {
    messageDiv.innerText = text
    messageDiv.className = `mt-4 text-sm ${type === 'success' ? 'text-green-600' : 'text-red-500'}`
}

const limparFormulario = () => {
    formModelo.reset()
    campoId.value = ''
    tituloFormulario.innerText = 'Incluir modelo'
    btnSalvar.innerText = 'Salvar'
    btnCancelar.classList.add('hidden')
}

const criarCelula = (text, className = 'p-3 border border-blue-600') => {
    const td = document.createElement('td')
    td.className = className
    td.innerText = text
    return td
}

const criarBotaoAcao = (text, className, modelo) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.innerText = text
    button.className = className
    button.dataset.id = modelo.id
    button.dataset.marca = modelo.marca
    button.dataset.descricao = modelo.descricao
    return button
}

async function carregarModelos(){
    const {data, error} = await supabase
    .from('modelos')
    .select('*')
    .order('marca',{ascending: true})

    if(error){
        showMessage('Erro ao carregar os modelos: ' + error.message)
        return
    }
    if(data.length === 0){
        tabela.innerHTML = `
        <tr>
          <td colspan='3' class='p-3 text-center text-gray-500'>Nenhum modelo encontrado</td>
        </tr>
        `
        return
    }
    tabela.innerHTML = '' //limpamos a tabela
    data.forEach((modelo) => {
        const tr = document.createElement('tr')
        const tdAcoes = document.createElement('td')
        const btnEditar = criarBotaoAcao(
            'Editar',
            'btn-editar bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600',
            modelo,
        )
        const btnExcluir = criarBotaoAcao(
            'Excluir',
            'btn-excluir bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-2',
            modelo,
        )

        tr.className = 'border-t hover:bg-gray-400'
        tdAcoes.className = 'p-3 border border-blue-600 text-right'
        tdAcoes.append(btnEditar, btnExcluir)
        tr.append(
            criarCelula(modelo.marca),
            criarCelula(modelo.descricao),
            tdAcoes,
        )
        tabela.appendChild(tr)
    })
}

formModelo.addEventListener('submit', async (e) => {
    e.preventDefault()

    const id = campoId.value
    const modelo = {
        marca: campoMarca.value.trim(),
        descricao: campoDescricao.value.trim(),
    }

    if(!modelo.marca || !modelo.descricao){
        showMessage('Preencha marca e modelo.')
        return
    }

    const query = id
        ? supabase.from('modelos').update(modelo).eq('id', id)
        : supabase.from('modelos').insert(modelo)

    const { error } = await query

    if(error){
        showMessage('Erro ao salvar: ' + error.message)
        return
    }

    showMessage(id ? 'Modelo alterado com sucesso.' : 'Modelo incluido com sucesso.', 'success')
    limparFormulario()
    carregarModelos()
})

tabela.addEventListener('click', async (e) => {
    const btnEditar = e.target.closest('.btn-editar')
    const btnExcluir = e.target.closest('.btn-excluir')

    if(btnEditar){
        campoId.value = btnEditar.dataset.id
        campoMarca.value = btnEditar.dataset.marca
        campoDescricao.value = btnEditar.dataset.descricao
        tituloFormulario.innerText = 'Alterar modelo'
        btnSalvar.innerText = 'Alterar'
        btnCancelar.classList.remove('hidden')
        campoMarca.focus()
        return
    }

    if(btnExcluir){
        const confirmou = confirm(`Excluir o modelo "${btnExcluir.dataset.descricao}"?`)

        if(!confirmou){
            return
        }

        const { error } = await supabase
            .from('modelos')
            .delete()
            .eq('id', btnExcluir.dataset.id)

        if(error){
            showMessage('Erro ao excluir: ' + error.message)
            return
        }

        showMessage('Modelo excluido com sucesso.', 'success')
        limparFormulario()
        carregarModelos()
    }
})

btnCancelar.addEventListener('click', limparFormulario)

btnLogout.addEventListener('click', async() => {
    await supabase.auth.signOut()
    window.location.assign('./index.html')
})

carregarModelos()
