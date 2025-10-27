import { useNavigate } from "react-router-dom";
import { MapPin, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PropTypes from "prop-types";

const EventListItem = ({ event }) => {
  const navigate = useNavigate();

  const { id, title, type, location } = event;

  return (
    <Card
      className="w-full max-w-3xl mx-auto mb-6 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border-none bg-white rounded-xl"
      onClick={() => navigate(`/dashboard/events/${id}`)}
    >
      <CardContent className="p-6 flex justify-between items-center">
        <div className="flex-1 space-y-3">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-2 text-emerald-600" />
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-md"
              >
                {type}
              </Badge>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
              <span>
                {location?.name}
                {location?.city && `, ${location?.city}`}
                {location?.country && `, ${location?.country}`}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

EventListItem.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    location: PropTypes.shape({
      name: PropTypes.string,
      city: PropTypes.string,
      country: PropTypes.string,
    }),
  }).isRequired,
};

export default EventListItem;
