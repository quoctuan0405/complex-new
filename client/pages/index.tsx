import { NextPage } from 'next';
import { Button, Card, Divider, Grid, List, Paper, TextField, Typography, ListItem, ListItemText } from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
import { ChangeEvent, FormEvent, useState } from "react";
import axios from 'axios';

interface RedisValues {
    [key: number]: number
}

interface PostgresValues {
    [key: string]: number
    number: number
}

interface IndexPageProps {
    indexes: PostgresValues[];
    redisValues: RedisValues;
}

const useStyles = makeStyles((theme) => ({
    paper: {
        background: theme.palette.primary.main,
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.primary,
    },
    body: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2)
    },
    card: {
        padding: theme.spacing(2),
        height: "100%"
    },
    listItemText: {
        textAlign: "center"
    }
  }));

const IndexPage: NextPage<IndexPageProps> = ({indexes, redisValues}) => {
    const classes = useStyles();

    const [seenIndexes, setSeenIndexes] = useState<PostgresValues[]>(indexes);
    const [values, setValues] = useState<RedisValues>(redisValues);
    const [index, setIndex] = useState<string>("");

    const renderSeenIndexes = () => {
        return seenIndexes.map(({number: index}) => index).join(', ')
    }

    const renderValues = () => {
        const entries = [];

        for (let key in values) {
            entries.push(
                <ListItem key={key} button>
                    <ListItemText 
                        className={classes.listItemText} 
                        primary={`For index ${key} I calculated value ${values[key]}`}
                    />
                </ListItem>
            );
        }

        return entries;
    }

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await axios.post('/api/values', {index});

        setIndex("");
    }

    const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setIndex(event.target.value);
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Card className={classes.paper}>
                    <Typography variant="h4">Fibonacci Calculator</Typography>
                </Card>
            </Grid>

            <Grid item xs={12} className={classes.body}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Card className={classes.card}>
                            <form onSubmit={(event) => onSubmit(event)}>
                                <Grid container spacing={2} justify="center" alignItems="center">
                                    <Grid item>
                                        <TextField 
                                            value={index} 
                                            onChange={(event) => onChange(event)}
                                            variant="outlined" 
                                            label="Enter your index"
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Button type="submit" variant="contained" color="primary">Compute</Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container spacing={1} alignContent="stretch" alignItems="stretch">
                            <Grid item xs={12} sm={6}>
                                <Card className={classes.card}>
                                    <Typography color="textSecondary" align="center" gutterBottom>
                                        Indexes I have seen
                                    </Typography>
                                    <Divider/>
                                    <List component="nav">
                                        <ListItem>
                                            <ListItemText className={classes.listItemText} primary={renderSeenIndexes()}/>
                                        </ListItem>
                                    </List>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Card className={classes.card}>
                                    <Typography color="textSecondary" align="center" gutterBottom>
                                        Calculated values
                                    </Typography>
                                    <Divider/>
                                    <List component="nav">
                                        {renderValues()}
                                    </List>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

IndexPage.getInitialProps = async () => {
    const {data: indexes} = await axios.get<PostgresValues[]>(`http://my-release-ingress-nginx-controller/api/values/all`);
    console.log(indexes);
    const {data: redisValues} = await axios.get<RedisValues>(`http://my-release-ingress-nginx-controller/api/values/current`)

    return {indexes, redisValues};
}

export default IndexPage;