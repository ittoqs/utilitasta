import { useParams } from 'react-router-dom';
import UtilityRegistry from '../components/utilities/UtilityRegistry';

export default function Utility() {
  const { id } = useParams();

  if (!id) return <div>No utility selected.</div>;

  return <UtilityRegistry id={id} />;
}
