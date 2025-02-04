console.log("Script carregado");

let registros = JSON.parse(localStorage.getItem('registrosBeneficios')) || [
    { id: 1, colaborador: 'João Silva', beneficiario: 'Maria Silva', tipo: 'conv_medico', data: '2023-10-01', operacao: 'inclusao', observacoes: 'Primeira inclusão' },
    { id: 2, colaborador: 'Carlos Souza', beneficiario: 'Ana Souza', tipo: 'vt', data: '2023-10-02', operacao: 'inclusao', observacoes: 'Segunda inclusão' },
    { id: 3, colaborador: 'Pedro Oliveira', beneficiario: 'Lucas Oliveira', tipo: 'fretado', data: '2023-10-03', operacao: 'inclusao', observacoes: 'Terceira inclusão' }
];

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
    atualizarDashboard(); // Atualizar dashboard ao adicionar novo registro
}

// Função para atualizar o histórico
function atualizarHistorico() {
    const tbody = document.getElementById('historicoBody');
    tbody.innerHTML = '';

    registros.forEach(registro => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatarData(registro.data)}</td>
            <td class="hidden colaborador">${registro.colaborador}</td>
            <td class="hidden beneficiario">${registro.beneficiario}</td>
            <td>${traduzirTipo(registro.tipo)}</td>
            <td>${registro.operacao === 'inclusao' ? '✅ Inclusão' : '❌ Exclusão'}</td>
            <td>${registro.observacoes || '-'}</td>
            <td>
                <button class="show-details-btn" onclick="mostrarDetalhes(this)">Mostrar Detalhes</button>
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

// Função para atualizar o dashboard
function atualizarDashboard() {
    const ctx1 = document.getElementById('graficoBeneficios').getContext('2d');
    const ctx2 = document.getElementById('graficoTiposBeneficios').getContext('2d');

    // Agrupar dados por tipo de benefício
    const tipos = ['conv_medico', 'conv_odontologico', 'vt', 'fretado'];
    const contagem = tipos.map(tipo => registros.filter(d => d.tipo === tipo).length);

    console.log("Contagem de tipos:", contagem);

    if (window.graficoBeneficios) {
        window.graficoBeneficios.destroy();
    }

    window.graficoBeneficios = new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: tipos.map(traduzirTipo),
            datasets: [{
                data: contagem,
                backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    if (window.graficoTiposBeneficios) {
        window.graficoTiposBeneficios.destroy();
    }

    window.graficoTiposBeneficios = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: tipos.map(traduzirTipo),
            datasets: [{
                label: 'Benefícios',
                data: contagem,
                backgroundColor: "#4BC0C0"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Carregar histórico ao iniciar
atualizarHistorico();
atualizarDashboard(); // Atualizar dashboard ao carregar a página

// Adicionar event listeners para atualizar o dashboard em tempo real
document.getElementById('colaborador').addEventListener('input', atualizarDashboard);
document.getElementById('beneficiario').addEventListener('input', atualizarDashboard);
document.getElementById('benefitType').addEventListener('change', atualizarDashboard);
document.getElementById('dataRegistro').addEventListener('input', atualizarDashboard);
document.querySelectorAll('input[name="operacao"]').forEach(radio => {
    radio.addEventListener('change', atualizarDashboard);
});
document.getElementById('observacoes').addEventListener('input', atualizarDashboard);
