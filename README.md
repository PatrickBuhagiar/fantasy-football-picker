# fantasy-football-picker

A script that picks a Fantasy Football Team within budget. 

A team is selected using the Monte Carlo method. Essentially, a team is chosen at random several times and the best one is kept. 

## pre-requisites
At least NodeJS v12.21.0

## How to run

```
nvm use
yarn install
```
and then run:
```
yarn run randomTeamGenerator
```

you can specify how many random picks it should do, or pass in a specific max team value. For example, to try 100 random teams with a max value of £99.5 million do:
```
yarn run randomTeamGenerator -r 100 -v 995
```