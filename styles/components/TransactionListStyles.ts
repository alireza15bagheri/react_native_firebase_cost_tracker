// styles/components/TransactionListStyles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemAmount: {
    color: '#b0b0b0',
    fontSize: 16,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    paddingVertical: 10,
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    color: '#ff453a',
    fontSize: 18,
  },
});