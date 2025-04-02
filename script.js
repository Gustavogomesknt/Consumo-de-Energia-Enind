// Função para calcular o consumo em kWh com bandeira tarifária
function calcularConsumoEmKwh(valorConta, bandeira) {
    // Definir os custos adicionais conforme a bandeira
    let custoBandeira = 0;
    if (bandeira === "verde") {
        custoBandeira = 0; // Sem custo adicional na bandeira verde
    } else if (bandeira === "amarela") {
        custoBandeira = 1.885; // Custo adicional na bandeira amarela (por 100 kWh)
    } else if (bandeira === "vermelha1") {
        custoBandeira = 4.463; // Custo adicional na bandeira vermelha patamar 1 (por 100 kWh)
    } else if (bandeira === "vermelha2") {
        custoBandeira = 7.877; // Custo adicional na bandeira vermelha patamar 2 (por 100 kWh)
    } else {
        console.error("Bandeira inválida.");
        return;
    }

    // Valor médio do kWh base (sem bandeira)
    let custoBasePorKwh = 0.75;  // Este valor pode ser ajustado conforme a média do custo de kWh

    // Calculando o custo total por kWh (base + custo da bandeira)
    let custoTotalPorKwh = custoBasePorKwh + (custoBandeira / 100);

    // Calculando o consumo em kWh
    let consumoKwh = valorConta / custoTotalPorKwh;

    return consumoKwh;
}

// Função para lidar com o evento do formulário
document.getElementById("form").addEventListener("submit", function(event) {
    event.preventDefault(); // Impede o envio do formulário

    // Pega os valores dos inputs
    let valorConta = parseFloat(document.getElementById("valorConta").value);
    let bandeira = document.getElementById("bandeira").value;

    // Verifica se os valores são válidos
    if (isNaN(valorConta)) {
        alert("Por favor, preencha o valor da conta corretamente.");
        return;
    }

    // Calcula o consumo médio em kWh com base na bandeira
    let consumoKwh = calcularConsumoEmKwh(valorConta, bandeira);

    // Exibe o resultado
    document.getElementById("consumoMedio").innerText = `Consumo médio estimado: ${consumoKwh.toFixed(2)} kWh`;
});
