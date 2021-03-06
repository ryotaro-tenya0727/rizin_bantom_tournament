import React, { Fragment } from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';

//styled-components

const Name = styled.div`
  text-align: center;
`;

const Card = styled.div`
  width: 200px;
  height: 200px;
`;

const FighterImageNode = styled.img`
  width: 200px;
`;

const theme = createTheme({
  palette: {
    secondary: {
      main: '#FF0000',
    },
  },
});

const ButtonWrapper = styled.div`
  text-align: center;
`;

export const FighterWrapper = ({
  fighter,
  imageUrl,
  onClickFighterWrapper,
  onClickVote,
}) => {
  return (
    <Fragment>
      <Name>{fighter.name}</Name>
      <Card>
        <FighterImageNode src={imageUrl} />
      </Card>
      <ThemeProvider theme={theme}>
        <ButtonWrapper>
          <Button
            variant='contained'
            size='large'
            color='secondary'
            sx={{ width: '100%', mt: 1 }}
            onClick={() => {
              onClickFighterWrapper(fighter);
              onClickVote(fighter);
            }}
          >
            {fighter.name}に投票する
          </Button>
        </ButtonWrapper>
      </ThemeProvider>
    </Fragment>
  );
};
