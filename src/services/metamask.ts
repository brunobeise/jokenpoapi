import Web3 from "web3";

// Cria a instância do Web3 utilizando o provider local do Ethereum
const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/");

// Testa a conexão com o nó
web3.eth.net
  .isListening()
  .then(() => console.log("Conexão com o nó estabelecida com sucesso!"))
  .catch((error: any) => console.error(`Falha ao conectar com o nó: ${error}`));

export async function monitoringByHash(txHash: string) {
  console.log("monitorando..." + txHash);

  const receipt = await web3.eth.getTransactionReceipt(txHash);
  console.log(receipt.status);

  if (!receipt) return "Aguardando...";

  return receipt.status
}
