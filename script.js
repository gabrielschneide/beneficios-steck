document.addEventListener("DOMContentLoaded", function () {
    // Seleção de elementos do formulário
    const form = document.getElementById("formulario");
    const tabela = document.getElementById("tabela-dados").getElementsByTagName("tbody")[0];

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Coletando dados do formulário
        const nome = document.getElementById("nome").value;
        const idade = document.getElementById("idade").value;
        const cidade = document.getElementById("cidade").value;
        const participacao = document.querySelector('input[name="participacao"]:checked').value;
        const pontoEncontro = document.getElementById("ponto-encontro").value;

        // Adicionando os dados na tabela
        const newRow = tabela.insertRow();
        newRow.insertCell(0).textContent = nome;
        newRow.insertCell(1).textContent = idade;
        newRow.insertCell(2).textContent = cidade;
        newRow.insertCell(3).textContent = participacao;
        newRow.insertCell(4).textContent = pontoEncontro;

        // Resetando o formulário
        form.reset();

        // Atualizar gráficos
        atualizarGraficos();
    });

    // Gráficos
    function atualizarGraficos() {
        const rows = tabela.getElementsByTagName("tr");
        let contagemCidades = {};
        let contagemParticipacao = { Sim: 0, Não: 0 };

        for (let i = 0; i < rows.length; i++) {
            let cells = rows[i].getElementsByTagName("td");
            if (cells.length > 0) {
                let cidade = cells[2].textContent;
                let participacao = cells[3].textContent;

                contagemCidades[cidade] = (contagemCidades[cidade] || 0) + 1;
                contagemParticipacao[participacao]++;
            }
        }

        gerarGraficoCidades(contagemCidades);
        gerarGraficoParticipacao(contagemParticipacao);
    }

    function gerarGraficoCidades(data) {
        const ctx = document.getElementById("grafico-cidades").getContext("2d");
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: "Número de Participantes",
                    data: Object.values(data),
                    backgroundColor: "#d32f2f",
                }],
            },
        });
    }

    function gerarGraficoParticipacao(data) {
        const ctx = document.getElementById("grafico-participacao").getContext("2d");
        new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["Sim", "Não"],
                datasets: [{
                    data: [data["Sim"], data["Não"]],
                    backgroundColor: ["#4CAF50", "#F44336"],
                }],
            },
        });
    }
});
