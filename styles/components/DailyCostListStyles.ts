// styles/components/DailyCostListStyles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 10,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemValue: {
    flex: 1,
    textAlign: 'right',
    color: '#b0b0b0',
    fontSize: 16,
    marginLeft: 10,
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    color: '#ff453a',
    fontSize: 18,
  },
  addNewButton: {
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  addNewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});