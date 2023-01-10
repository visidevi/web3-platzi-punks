import { useWeb3React } from "@web3-react/core";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PunkCard from "../../components/punk-card";
import { useState, useEffect } from "react";
import Loading from "../../components/loading";
import RequestAccess from "../../components/request-access";
import {
  Grid,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Button,
  FormControl,
  FormHelperText,
} from "@chakra-ui/react";

import { usePlatziPunksData } from "../../hooks/usePlatziPunksData";
import { SearchIcon } from "@chakra-ui/icons";
const Punks = () => {
  const { search } = useLocation();
  const { active, library } = useWeb3React();
  const [address, setAddress] = useState();
  const [validAddress, setValidAddress] = useState(false);
  const { push } = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const addressUrl=new URLSearchParams(search).get("address")
  useEffect(() => {
    setAddress(addressUrl);
  }, [addressUrl]);

  const { punks, loading } = usePlatziPunksData({
    owner: submitted && validAddress ? address : null,
  });

  const handleAddressChange = ({ target: { value } }) => {
    setAddress(value);
    setSubmitted(false);
    setValidAddress(false);
  };
  const submit = (e) => {
    e.preventDefault();
    if (address) {
      const isValid = library.utils.isAddress(address);
      setValidAddress(isValid);
      setSubmitted(true);
      if (isValid) {
        push(`/punks?address=${address}`);
      }
    } else {
      push("/punks");
    }
  };
  if (!active) return <RequestAccess />;
  return (
    <>
      <form onSubmit={submit}>
        <FormControl>
          <InputGroup mb={3}>
            <InputLeftElement
              pointEvent="none"
              children={<SearchIcon color="gray.300"></SearchIcon>}
            >
              {" "}
            </InputLeftElement>
            <Input
              invalid={false}
              value={address ?? ""}
              onChange={handleAddressChange}
            ></Input>
            <InputRightElement width="5.5rem">
              <Button type="submit" h="1.75rem" size="sm">
                Buscar
              </Button>
            </InputRightElement>
          </InputGroup>
          {submitted && !validAddress && (
            <FormHelperText>Wrong Address</FormHelperText>
          )}
        </FormControl>
      </form>
      {loading ? (
        <Loading />
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr)" gap={6}>
          {punks.map(({ name, image, tokenId }) => {
            return (
              <Link key={tokenId} to={`/punks/${tokenId}`}>
                <PunkCard name={name} image={image}></PunkCard>
              </Link>
            );
          })}
        </Grid>
      )}
    </>
  );
};
export default Punks;
