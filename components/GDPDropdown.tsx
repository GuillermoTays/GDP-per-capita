"use client";

import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  cn,
} from "@nextui-org/react";
import Image from "next/image";

import Finland from "./finland.png";
import France from "./france.png";
import axios from "axios";

export default function GDPDropdown() {
  const defaultOption = <>Select a Country</>;
  const [option, setOption] = useState(defaultOption);
  const [country, setCountry] = useState("");
  const [gdp, setGdp] = useState("$ 0.0");

  useEffect(() => {
    if (country === "") return;
    const getGDP = async () => {
      const formatCurrency = (amount: any) => {
        const formattedAmount = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount);

        return formattedAmount.replace("$", "$ ");
      };
      const gdpres = await axios.get(
        `https://api.worldbank.org/v2/country/${country}/indicator/NY.GDP.MKTP.CD?format=json`
      );

      // Assuming the response format is JSON and contains the GDP data
      const gdpData = gdpres.data[1][0].value;
      const popres = await fetch(
        `https://restcountries.com/v3.1/name/${country}`
      );
      const data = await popres.json();

      // Assuming the API response is an array of countries (even if only one is requested)
      const selectedCountry = data[0];
      setGdp(formatCurrency(gdpData / selectedCountry.population));
    };
    getGDP();
  }, [country]);

  return (
    <div className="flex flex-row items-center gap-4">
      <div>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered" fullWidth>
              {option}
            </Button>
          </DropdownTrigger>
          <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
            <DropdownItem
              key="finland"
              startContent={
                <Image
                  src={Finland}
                  alt="Finland Flag"
                  width={24}
                  height={24}
                />
              }
              onClick={() => {
                const option = (
                  <>
                    <Image
                      src={Finland}
                      alt="Finland Flag"
                      width={24}
                      height={24}
                    />
                    Finland
                  </>
                );
                setOption(option);
                setCountry("fin");
              }}
            >
              Finland
            </DropdownItem>
            <DropdownItem
              key="france"
              startContent={
                <Image src={France} alt="France Flag" width={24} height={24} />
              }
              onClick={() => {
                const option = (
                  <>
                    <Image
                      src={France}
                      alt="France Flag"
                      width={24}
                      height={24}
                    />
                    France
                  </>
                );
                setOption(option);
                setCountry("fr");
              }}
            >
              France
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div>{gdp}</div>
    </div>
  );
}
