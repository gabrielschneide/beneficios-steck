console.log("Script carregado");

let registros = JSON.parse(localStorage.getItem('registrosBeneficios')) || [];

console.log("Registros carregados:", registros);

// Função para validar e adicionar registro
function validarFormulario() {
    const colaborador = document.getElementById('colaborador').value.trim();
    const beneficiario = document.getElementById('beneficiario').value.trim();
    const benefitType = document.getElementById('benefitType').value;
    const dataRegistro = document.getElementById('dataRegistro').value;

    if (!colaborador || !beneficiario || !benefitType || !dataRegistro) {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }

    const registro = {
        id: Date.now(),
        colaborador,
        beneficiario,
        tipo: benefitType,
        data: dataRegistro,
        operacao: document.querySelector('input[name="operacao"]:checked').value,
        observacoes: document.getElementById('observacoes').value.trim()
    };

    registros.unshift(registro);
    localStorage.setItem('registrosBeneficios', JSON.stringify(registros));
    atualizarHistorico();
    limparFormulario();
}

// Função para atualizar o histórico
function atualizarHistorico() {
    const tbody = document.getElementById('historicoBody');
    tbody.innerHTML = '';

    registros.forEach(registro => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatarData(registro.data)}</td>
            <td>${registro.colaborador}</td>
            <td>${registro.beneficiario}</td>
            <td>${traduzirTipo(registro.tipo)}</td>
            <td>${registro.operacao === 'inclusao' ? '✅ Inclusão' : '❌ Exclusão'}</td>
            <td>${registro.observacoes || '-'}</td>
            <td>
                <button class="show-details-btn" onclick="mostrarDetalhes(this)">Mostrar Detalhes</button>
                <button class="excluir-btn" onclick="excluirRegistro(${registro.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Função para mostrar detalhes (nomes)
function mostrarDetalhes(btn) {
    const tr = btn.closest('tr');
    tr.querySelectorAll('.hidden').forEach(el => {
        el.classList.toggle('hidden');
    });
    btn.textContent = btn.textContent === 'Mostrar Detalhes' ? 'Ocultar Detalhes' : 'Mostrar Detalhes';
}

// Função para excluir registro
function excluirRegistro(id) {
    registros = registros.filter(registro => registro.id !== id);
    localStorage.setItem('registrosBeneficios', JSON.stringify(registros));
    atualizarHistorico();
}

// Função auxiliar para traduzir tipos
function traduzirTipo(tipo) {
    switch (tipo) {
        case 'conv_medico': return 'Convênio Médico';
        case 'conv_odontologico': return 'Convênio Odontológico';
        case 'vt': return 'Vale Transporte';
        case 'fretado': return 'Transporte Fretado';
        default: return 'Desconhecido';
    }
}

// Função para formatar data
function formatarData(dataString) {
    const data = new Date(dataString);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

// Função para limpar formulário
function limparFormulario() {
    document.getElementById('colaborador').value = '';
    document.getElementById('beneficiario').value = '';
    document.getElementById('benefitType').value = '';
    document.getElementById('dataRegistro').value = '';
    document.getElementById('observacoes').value = '';
    document.querySelector('input[name="operacao"][value="inclusao"]').checked = true;
}

// Função para filtrar o histórico
function filtrarHistorico() {
    const filtroMes = document.getElementById('filtroMes').value;
    const filtroTipo = document.getElementById('filtroTipo').value;

    const registrosFiltrados = registros.filter(registro => {
        const data = new Date(registro.data);
        const mesAno = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
        const dataMatch = !filtroMes || mesAno === filtroMes;
        const tipoMatch = !filtroTipo || registro.tipo === filtroTipo;
        return dataMatch && tipoMatch;
    });

    const tbody = document.getElementById('historicoBody');
    tbody.innerHTML = '';

    registrosFiltrados.forEach(registro => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatarData(registro.data)}</td>
            <td>${registro.colaborador}</td>
            <td>${registro.beneficiario}</td>
            <td>${traduzirTipo(registro.tipo)}</td>
            <td>${registro.operacao === 'inclusao' ? '✅ Inclusão' : '❌ Exclusão'}</td>
            <td>${registro.observacoes || '-'}</td>
            <td>
                <button class="show-details-btn" onclick="mostrarDetalhes(this)">Mostrar Detalhes</button>
                <button class="excluir-btn" onclick="excluirRegistro(${registro.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Carregar histórico ao iniciar
atualizarHistorico();
