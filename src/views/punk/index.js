import {
    Stack,
    Heading,
    Text,
    Table,
    Thead,
    Tr,
    Th,
    Td,
    Tbody,
    Button,
    Tag,
    useToast,
  } from "@chakra-ui/react";
  import {useState} from "react"
  import { useWeb3React } from "@web3-react/core";
  import RequestAccess from "../../components/request-access";
  import PunkCard from "../../components/punk-card";
  import { usePlatziPunkData } from "../../hooks/usePlatziPunksData";
  import { useParams } from "react-router-dom";
  import Loading from "../../components/loading";
import usePlatziPunks from "../../hooks/usePlatziPunks";

  const Punk = () => {
    const { active, account, library } = useWeb3React();
    const { tokenId } = useParams();
    const { loading, punk,  update } = usePlatziPunkData(tokenId);

    const toast = useToast()
    const [transferring, setTransferring] = useState(false)
    const platziPunks =  usePlatziPunks()
    const transfer = () => {
      setTransferring(true)
      const address = prompt("Set your address: ")
      const isAddress = library.utils.isAddress(address)
      console.log(isAddress)
      if (!isAddress) {
        toast({
          title:"Wrong Address",
          description:"The address is not a eth address",
          status:"error"
        })
        setTransferring(false)
      } else {
        platziPunks.methods.safeTransferFrom( punk.owner, address, punk.tokenId).send({
          from: account
        }).on("transactionHash", (txHash) => {
        toast({
          title: "Transaction created.",
          description: txHash,
          status: "info",
          duration: 9000,
          isClosable: true,
        });
      })
      .on("receipt", () => {
        console.log("receipt");
        toast({
          title: "Transfer Transaction confirmed.",
          description: `This punk now belong to ${address}`,
          status: "success",
        });
        update()
        setTransferring(false)
      })
      .on("error", (error) => {
        toast({
          title: "Transaction Failed.",
          description: error.message,
          status: "error",
        });
        setTransferring(false)
      });
      }
      
    }
    if (!active) return <RequestAccess />;
    if (loading) return <Loading />;



    return (
      <Stack
        spacing={{ base: 8, md: 10 }}
        py={{ base: 5 }}
        direction={{ base: "column", md: "row" }}
      >
        <Stack>
          <PunkCard
            mx={{
              base: "auto",
              md: 0,
            }}
            name={punk.name}
            image={punk.image}
          />
          <Button disabled={account !== punk.owner} onClick={transfer}  isLoading={transferring} colorScheme="green">
            {account !== punk.owner ? "No eres el dueño" : "Transferir"}
          </Button>
        </Stack>
        <Stack width="100%" spacing={5}>
          <Heading>{punk.name}</Heading>
          <Text fontSize="xl">{punk.description}</Text>
          <Text fontWeight={600}>
            DNA:
            <Tag ml={2} colorScheme="green">
              {punk.dna}
            </Tag>
          </Text>
          <Text fontWeight={600}>
            Owner:
            <Tag ml={2} colorScheme="green">
              {punk.owner}
            </Tag>
          </Text>
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th>Atributo</Th>
                <Th>Valor</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.entries(punk.attributes).map(([key, value]) => (
                <Tr key={key}>
                  <Td>{key}</Td>
                  <Td>
                    <Tag>{value}</Tag>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Stack>
      </Stack>
    );
  };
  
  export default Punk;