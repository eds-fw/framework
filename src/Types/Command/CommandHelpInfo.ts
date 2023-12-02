export interface CommandHelpInfo
{
   name:          string;
   slash:         boolean;

   usage?:        string;
   usageDocs?:    string;
   desc?:         string;
   category?:     string;
   allowInDM?:    boolean;
   hidden?:       boolean;
   /** Do not add 'everyone' role ID */
   allowedRoles?: string[];
}