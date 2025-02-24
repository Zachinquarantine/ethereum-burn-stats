import {
  Box,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Heading,
  Radio,
  RadioGroup,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link as ReactLink } from "react-router-dom";
import { Card } from "../components/Card";
import { Setting, EthereumNetworkOptions } from "../config";
import { useEthereum } from "../contexts/EthereumContext";
import { useSettings } from "../contexts/SettingsContext";
import { debounce } from "../utils/debounce";
import { navigateToSubdomain } from "../utils/subdomain";

export function Settings() {
  const { eth } = useEthereum()
  const firstFieldRef = useRef(null);
  const settings = useSettings();
  const [maxBlocks, setMaxBlocks] = useState<number>(
    settings.get(Setting.maxBlocksToRender)
  );

  useEffect(() => {
    settings.set(Setting.maxBlocksToRender, maxBlocks);
  }, [settings, maxBlocks]);

  const changeHandler = (value: number) => {
    if (value > 0) setMaxBlocks(value);
  };

  const debouncedChangeHandler = useMemo(
    () => debounce(changeHandler, 300),
    []
  );

  const changeNetwork = (network: string) => {
    navigateToSubdomain(network)
  }

  return (
    <Flex flex="1" direction="column"
        pt={["4", "4", "0"]}
        pl={["4", "4", "8"]}
        pr={["4", "4", "8"]}
        pb={["8", "8", "12"]} gridGap={4}>
      <Breadcrumb>
        <BreadcrumbItem fontSize="lg" fontWeight="bold">
          <BreadcrumbLink as={ReactLink} to="/blocks">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <Text>Settings</Text>
        </BreadcrumbItem>
      </Breadcrumb>
      <Box w="100%">
        <Heading size="sm" color="brand.secondaryText">
          Ethereum Network
        </Heading>
        <Card mt="2">
          <RadioGroup
            onChange={changeNetwork}
            defaultValue={eth?.connectedNetwork.key}
            ref={firstFieldRef}
          >
            <Flex direction={['column', 'column', 'row']} gridGap={4}>
              <Radio value={EthereumNetworkOptions.ropsten.key}>{EthereumNetworkOptions.ropsten.name}</Radio>
              <Radio value={EthereumNetworkOptions.goerli.key}>{EthereumNetworkOptions.goerli.name}</Radio>
              <Radio value={EthereumNetworkOptions.rinkeby.key}>{EthereumNetworkOptions.rinkeby.name}</Radio>
              <Radio value={EthereumNetworkOptions.mainnet.key} isDisabled>{EthereumNetworkOptions.mainnet.name}</Radio>
            </Flex>
          </RadioGroup>
        </Card>
      </Box>

      <Box w="100%">
        <Heading size="sm" color="brand.secondaryText">
          Max Blocks to Render ({maxBlocks} blocks)
        </Heading>
        <Card mt="2">
          <Slider
            min={5}
            defaultValue={maxBlocks}
            max={100}
            step={5}
            onChangeEnd={debouncedChangeHandler}
          >
            <SliderTrack bg="red.100">
              <Box position="relative" right={10} />
              <SliderFilledTrack bg="brand.orange" />
            </SliderTrack>
            <SliderThumb boxSize={6} />
          </Slider>
        </Card>
      </Box>
    </Flex>
  );
}
