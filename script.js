let ultimoResultado = null;

function calcularConsumoEmKwh(valorConta, bandeira, companhia) {
    let custoBasePorKwh;

    switch (companhia) {
        case "coelba": custoBasePorKwh = 0.78; break;
        case "enel": custoBasePorKwh = 0.72; break;
        case "cemig": custoBasePorKwh = 0.69; break;
        default: alert("Companhia inválida."); return;
    }

    let custoBandeira = 0;
    switch (bandeira) {
        case "verde": custoBandeira = 0; break;
        case "amarela": custoBandeira = 1.885; break;
        case "vermelha1": custoBandeira = 4.463; break;
        case "vermelha2": custoBandeira = 7.877; break;
        default: alert("Bandeira inválida."); return;
    }

    const custoTotalPorKwh = custoBasePorKwh + (custoBandeira / 100);
    return valorConta / custoTotalPorKwh;
}

document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();

    const valorConta = parseFloat(document.getElementById("valorConta").value);
    const bandeira = document.getElementById("bandeira").value;
    const companhia = document.getElementById("companhia").value;

    if (isNaN(valorConta) || valorConta <= 0) {
        alert("Informe um valor válido.");
        return;
    }

    const consumoKwh = calcularConsumoEmKwh(valorConta, bandeira, companhia);

    const hoje = new Date();
    ultimoResultado = {
        valorConta,
        bandeira,
        companhia,
        consumo: consumoKwh,
        data: hoje.toLocaleDateString('pt-BR'),
        mes: `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`
    };

    document.getElementById("consumoMedio").innerText =
        `Consumo estimado: ${consumoKwh.toFixed(2)} kWh`;
    document.getElementById("confirmarBtn").style.display = "block";
});

document.getElementById("confirmarBtn").addEventListener("click", function () {
    if (!ultimoResultado) return;

    const historico = JSON.parse(localStorage.getItem("historicoEnergia") || "[]");
    historico.push(ultimoResultado);
    localStorage.setItem("historicoEnergia", JSON.stringify(historico));

    renderizarHistorico();
    this.style.display = "none";
});

function renderizarHistorico() {
    const lista = document.getElementById("listaHistorico");
    const filtroMes = document.getElementById("filtroMes").value;
    lista.innerHTML = "";

    const historico = JSON.parse(localStorage.getItem("historicoEnergia") || "[]");

    const meses = new Set();
    historico.forEach(item => meses.add(item.mes));

    // Preenche filtro
    const selectMes = document.getElementById("filtroMes");
    selectMes.innerHTML = '<option value="">Todos os meses</option>';
    [...meses].sort().forEach(mes => {
        const opt = document.createElement("option");
        opt.value = mes;
        opt.text = new Date(mes + "-01").toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
        selectMes.appendChild(opt);
    });

    const filtrado = filtroMes ? historico.filter(i => i.mes === filtroMes) : historico;

    filtrado.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.data} - ${item.companhia.toUpperCase()}, ${item.bandeira}, R$ ${item.valorConta.toFixed(2)} → ${item.consumo.toFixed(2)} kWh`;
        lista.appendChild(li);
    });
}

document.getElementById("filtroMes").addEventListener("change", renderizarHistorico);

document.getElementById("limparHistorico").addEventListener("click", () => {
    if (confirm("Tem certeza que deseja apagar o histórico?")) {
        localStorage.removeItem("historicoEnergia");
        renderizarHistorico();
    }
});

document.getElementById("exportarPDF").addEventListener("click", () => {
    const lista = document.getElementById("listaHistorico").innerText;
    const win = window.open('', '', 'height=700,width=700');
    win.document.write('<pre>' + lista + '</pre>');
    win.document.close();
    win.print();
});

document.getElementById("exportarCSV").addEventListener("click", () => {
    const historico = JSON.parse(localStorage.getItem("historicoEnergia") || "[]");
    const csv = ["Data,Companhia,Bandeira,Valor (R$),Consumo (kWh)"];
    historico.forEach(i => {
        csv.push(`${i.data},${i.companhia},${i.bandeira},${i.valorConta},${i.consumo.toFixed(2)}`);
    });
    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "historico_consumo.csv";
    a.click();
    URL.revokeObjectURL(url);
});

renderizarHistorico();
