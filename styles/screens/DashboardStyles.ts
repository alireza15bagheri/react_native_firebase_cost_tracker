// styles/screens/DashboardStyles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: '#999',
  },
  welcomeUserText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  periodSelectorContainer: {
    marginBottom: 20,
  },
  pickerContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
  },
  picker: {
    color: '#fff',
  },
  pickerItem: {
    color: '#fff',
    backgroundColor: '#1e1e1e',
  },
  periodDateText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
  },
  deletePeriodButton: {
    backgroundColor: '#ff453a',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  deletePeriodButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
  },
  summaryContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
});