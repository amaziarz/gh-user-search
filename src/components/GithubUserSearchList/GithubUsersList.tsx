import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import type { GithubUser } from './types';

type Props = {
  users: GithubUser[];
};

export default function GithubUserSearchList({ users }: Props) {
  return (
    <List>
      {users.map((user) => (
        <ListItem key={user.id}>
          <ListItemButton component="a" href={user.html_url} target="_blank">
            <ListItemAvatar>
              <Avatar alt={user.login} src={user.avatar_url} />
            </ListItemAvatar>
            <ListItemText primary={user.login} secondary={user.type} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
