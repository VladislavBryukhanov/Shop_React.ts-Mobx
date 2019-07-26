import React, { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { inject, observer } from 'mobx-react';
import { CategoriesStore } from '../../../stores/categoriesStore';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { ICategory } from '../../../types/category';
import { RootStore } from '../../../stores/rootStore';

interface ICategoriesManagerProps {
  categoriesStore?: CategoriesStore
  rootStore?: RootStore
}
export const CategoriesManagerPage: React.FC<ICategoriesManagerProps> = inject('categoriesStore', 'rootStore')
(observer((props: ICategoriesManagerProps) => {
  const [ category, setCategory ] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  };

  const validateCategory = (category: string) => {
    if (category.length >= 1 && category.length <= 32) {
      return true;
    }
    props.rootStore!.showSnackbar(
      'Category must be longer then 1 and less then 32 characters!',
      5000
    );
  };

  const createCategory = async () => {
    if (validateCategory(category)) {
      const confirmation = await props.rootStore!.openConfirmationDialog(
        'Are you sure?',
        `Do you want create category "${category}"?`
      );

      if (confirmation) {
        await props.categoriesStore!.createCategory(category);
        setCategory('');
      }
    }
  };

  const removeCategory = async (category: ICategory) => {
    const confirmation = await props.rootStore!.openConfirmationDialog(
      'Are you sure?',
      `Do you want delete category "${category.name}" with all attached products?`
    );

    if (confirmation) {
      await props.categoriesStore!.removeCategory(category.id);
    }
  };

  return (
    <Grid container>
      <Grid item xl={4} lg={4} md={3} sm={2} xs={1}/>
      <Grid item xl={4} lg={4} md={6} sm={8} xs={10}>
        <Paper elevation={6}>
          <TextField
            fullWidth={true}
            variant="filled"
            label="Category"
            value={category}
            onChange={onChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={createCategory}>
                    <Icon color="primary">add</Icon>
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <List>
            <Divider light />
            {
              props.categoriesStore!.categories.map(category => (
                <div key={category.id}>
                  <ListItem button>
                    <ListItemText primary={category.name}/>
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => removeCategory(category)}>
                        <Icon color="error">close</Icon>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider light />
                </div>
              ))
            }
          </List>
        </Paper>
      </Grid>
    </Grid>
  )
}));
