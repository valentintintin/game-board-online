import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {gql} from "apollo-angular";
import {EntityUpdateDtoInput, UpdateEntityGQL} from "./generated.service";

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  private readonly updateEntityGQL = inject(UpdateEntityGQL);
  // private readonly updateGroupEntityGQL = inject(UpdateGroupEntityGQL);

  updateEntity(id: number, dto: EntityUpdateDtoInput): Observable<any> {
    gql`
      mutation updateEntity($entityId: Long!, $dto: EntityUpdateDtoInput!) {
        updateEntity(entityId: $entityId, dto: $dto) {
          id
          name
          x
          y
          rotation
          showBack
        }
      }
    `;

    return this.updateEntityGQL.mutate({
      entityId: id,
      dto: {
        x: dto.x,
        y: dto.y,
        rotation: dto.rotation,
        showBack: dto.showBack
      }
    });
  }

  // updateGroupEntity(id: number, dto: EntityGroupUpdateDtoInput): Observable<any> {
  //   gql`
  //     mutation updateGroupEntity($entityGroupId: Long!, $dto: EntityGroupUpdateDtoInput!) {
  //       updateGroupEntity(entityGroupId: $entityGroupId, dto: $dto) {
  //         id
  //         name
  //       }
  //     }
  //   `;
  //
  //   return this.updateGroupEntityGQL.mutate({
  //     entityGroupId: id,
  //     dto: {
  //     }
  //   });
  // }
}
