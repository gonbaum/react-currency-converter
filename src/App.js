import "./styles.css";
import { useState, useEffect } from "react";

import AppBar from "@material-ui/core/AppBar";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  body: {
    padding: "1em",
    fontFamily: "Roboto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  appBar: {
    paddingInlineStart: "1em"
  },
  formControl: {
    display: "flex",
    margin: theme.spacing(2),
    minWidth: 120,
    width: "30%"
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

export default function App() {
  const classes = useStyles();

  const [isLoading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("EUR");

  const [rate, setRate] = useState([]);
  const [exchangeRate, setExchangeRate] = useState([]);

  const [data, setData] = useState([]);

  const [availableRates, setAvailableRates] = useState([]);

  useEffect(() => {
    FetchData();
    console.log("Currency from:" + currency);
    setRate();
  }, [currency]);

  useEffect(() => {
    console.log("Exchange rate:" + rate);
    setExchangeRate(availableRates.filter((e) => e[0] === rate)[0]);
  }, [rate]);

  const FetchData = async () => {
    setLoading(true);
    const response = await (
      await fetch(`https://api.exchangeratesapi.io/latest?base=${currency}`)
    ).json();
    setData({ ...response });
    if (data) {
      setAvailableRates(Object.entries(response.rates));
      setLoading(false);
    }
  };

  const handleChangeCurrency = (event) => {
    setCurrency(event.target.value);
  };

  const handleChangeRate = (event) => {
    setRate(event.target.value);
  };

  return (
    <>
      <AppBar color="primary" position="static" className={classes.appBar}>
        <h1>Currency converter</h1>
      </AppBar>
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <div className={classes.body}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Currency</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="from"
              value={currency}
              onChange={handleChangeCurrency}
            >
              <MenuItem id="from" value={"EUR"}>
                Euro
              </MenuItem>
              <MenuItem id="from" value={"JPY"}>
                Japanese Yen
              </MenuItem>
              <MenuItem id="from" value={"CHF"}>
                Swiss Franc
              </MenuItem>
            </Select>
          </FormControl>
          <span> To: </span>

          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Convert to</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="to"
              value={rate}
              onChange={handleChangeRate}
            >
              {availableRates.map((e) => (
                <MenuItem value={`${e[0]}`}>{e[0]}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <h1>{`Currency: ${data.base}`}</h1>
          {!exchangeRate ? `Select currency to convert` : ""}
          <h1>
            {exchangeRate
              ? `${exchangeRate[0]}: ${
                  Math.round(exchangeRate[1] * 1000) / 1000
                }`
              : ""}
          </h1>
          <span>{`Date: ${data.date}`}</span>
        </div>
      )}
    </>
  );
}
